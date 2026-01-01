import { useEffect, useState } from "react";
import { mangaService } from "@/services/manga.service";
import { MangaCard } from "@/components/common/MangaCard";
import { userService } from "@/services/user.service";
import type { Manga } from "@/types/manga";
import type { ReadingHistoryItem } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface MangaReadingHistoryProps {
  readingHistory: ReadingHistoryItem[];
  onHistoryUpdate?: () => void;
}

interface MangaWithHistory extends Manga {
  lastReadChapterId?: string;
  lastReadAt?: string;
}

export const MangaReadingHistory = ({
  readingHistory,
  onHistoryUpdate,
}: MangaReadingHistoryProps) => {
  const [mangas, setMangas] = useState<MangaWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (readingHistory?.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Create a map of manga ID to reading history item
        const historyMap = new Map<string, ReadingHistoryItem>();
        readingHistory.forEach((item) => {
          historyMap.set(item.manga, item);
        });

        // Get unique manga IDs from reading history
        const mangaIds = Array.from(historyMap.keys());

        // Fetch manga details for each unique manga
        if (mangaIds.length > 0) {
          const mangaPromises = mangaIds.map((id) =>
            mangaService.getMangaById(id).catch(() => null)
          );
          const mangaResults = await Promise.all(mangaPromises);

          // Attach reading history info to each manga
          const mangasWithHistory = mangaResults
            .filter((result) => result)
            .map((manga) => {
              const historyItem = historyMap.get(manga!._id!);
              return {
                ...manga!,
                lastReadChapterId: historyItem?.chapterId,
                lastReadAt: historyItem?.lastReadAt,
              };
            });

          // Sort by last read time (newest first)
          mangasWithHistory.sort((a, b) => {
            const timeA = new Date(a.lastReadAt || 0).getTime();
            const timeB = new Date(b.lastReadAt || 0).getTime();
            return timeB - timeA;
          });

          setMangas(mangasWithHistory);
        }
      } catch (error) {
        console.error("Failed to fetch reading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingHistory();
  }, [readingHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleDeleteHistory = async (mangaIds: string[]) => {
    try {
      setBulkLoading(true);
      // Delete each manga from reading history
      await userService.deleteBatchReadingHistory(mangaIds);

      // Update local state
      setMangas((prev) => prev.filter((m) => !mangaIds.includes(m._id || "")));
      setSelectedIds({});

      toast.success(
        mangaIds.length === 1
          ? "Đã xóa lịch sử đọc truyện"
          : `Đã xóa lịch sử đọc ${mangaIds.length} truyện`
      );

      // Notify parent to refresh
      onHistoryUpdate?.();
    } catch (err) {
      console.error("Failed to delete reading history:", err);
      toast.error("Không thể xóa lịch sử đọc. Vui lòng thử lại.");
    } finally {
      setBulkLoading(false);
      setConfirmOpen(false);
      setPendingIds([]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Lịch sử đọc
        </h2>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <Checkbox
              checked={
                mangas.length > 0 &&
                Object.keys(selectedIds).length ===
                  mangas.filter((m) => m._id).length
                  ? true
                  : Object.keys(selectedIds).length > 0
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={(val) => {
                const checked = val === true;
                if (checked) {
                  const next: Record<string, boolean> = {};
                  mangas.forEach((m) => {
                    if (m._id) next[m._id] = true;
                  });
                  setSelectedIds(next);
                } else {
                  setSelectedIds({});
                }
              }}
            />
            <span className="text-muted-foreground">Chọn tất cả</span>
          </label>
          <>
            <Button
              variant="destructive"
              size="icon"
              disabled={Object.keys(selectedIds).length === 0 || bulkLoading}
              onClick={() => {
                const ids = Object.keys(selectedIds);
                if (ids.length === 0) return;
                setPendingIds(ids);
                setConfirmOpen(true);
              }}
              title={
                pendingIds.length > 0
                  ? `Xóa lịch sử ${pendingIds.length} truyện`
                  : "Xóa lịch sử đã chọn"
              }
            >
              <Trash2 className="size-4" />
            </Button>

            <ConfirmationModal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title={`Xóa lịch sử đọc ${pendingIds.length} truyện?`}
              message={`Bạn có chắc muốn xóa lịch sử đọc ${pendingIds.length} truyện đã chọn? Hành động này không thể phục hồi.`}
              confirmText="Xóa"
              cancelText="Hủy"
              variant="danger"
              loading={bulkLoading}
              onConfirm={() => handleDeleteHistory(pendingIds)}
            />
          </>
        </div>
      </div>

      {!mangas || mangas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào trong lịch sử đọc
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {mangas.map((manga) =>
            manga?._id ? (
              <div key={manga._id} className="relative">
                <div className="absolute z-10 left-3 top-3">
                  <Checkbox
                    checked={!!selectedIds[manga._id]}
                    onCheckedChange={(val) => {
                      const checked = val === true;
                      setSelectedIds((prev) => {
                        const next = { ...prev };
                        if (checked) next[manga._id!] = true;
                        else delete next[manga._id!];
                        return next;
                      });
                    }}
                    className="size-4 bg-white/90 backdrop-blur"
                  />
                </div>
                <MangaCard manga={manga} />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
