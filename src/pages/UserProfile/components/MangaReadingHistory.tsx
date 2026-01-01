import { useEffect, useState } from "react";
import { MangaCard } from "@/components/common/MangaCard";
import { userService } from "@/services/user.service";
import type { Manga } from "@/types/manga";
import type { ReadingHistoryWithProgress } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ReadingProgressInfo } from "./ReadingProgressInfo";

interface MangaReadingHistoryProps {
  onHistoryUpdate?: () => void;
}

export const MangaReadingHistory = ({
  onHistoryUpdate,
}: MangaReadingHistoryProps) => {
  const [historyItems, setHistoryItems] = useState<
    ReadingHistoryWithProgress[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        const data = await userService.getReadingHistory();
        setHistoryItems(data);
      } catch (error) {
        console.error("Failed to fetch reading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingHistory();
  }, []);

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
      setHistoryItems((prev) =>
        prev.filter((item) => !mangaIds.includes(item.manga._id))
      );
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
                historyItems.length > 0 &&
                Object.keys(selectedIds).length === historyItems.length
                  ? true
                  : Object.keys(selectedIds).length > 0
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={(val) => {
                const checked = val === true;
                if (checked) {
                  const next: Record<string, boolean> = {};
                  historyItems.forEach((item) => {
                    next[item.manga._id] = true;
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

      {!historyItems || historyItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào trong lịch sử đọc
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
          {historyItems.map((item) => {
            const manga: Manga = {
              _id: item.manga._id,
              title: item.manga.title,
              description: "",
              coverImage: item.manga.coverImage || "",
              author: "",
              genres: item.manga.genres || [],
              status: item.manga.status as
                | "ongoing"
                | "completed"
                | "hiatus"
                | "cancelled",
              createdAt: "",
              updatedAt: "",
              chapterCount: item.manga.totalChapters,
            };

            return (
              <div key={item.manga._id} className="flex flex-col gap-3 h-full">
                <div className="relative flex-1">
                  <div className="absolute z-10 left-3 top-3">
                    <Checkbox
                      checked={!!selectedIds[item.manga._id]}
                      onCheckedChange={(val) => {
                        const checked = val === true;
                        setSelectedIds((prev) => {
                          const next = { ...prev };
                          if (checked) next[item.manga._id] = true;
                          else delete next[item.manga._id];
                          return next;
                        });
                      }}
                      className="size-4 bg-white/90 backdrop-blur"
                    />
                  </div>
                  <MangaCard manga={manga} />
                </div>
                <ReadingProgressInfo
                  chapterId={item.currentChapter._id}
                  currentChapterNumber={item.currentChapter.chapterNumber}
                  totalChapters={item.manga.totalChapters}
                  progress={item.progress}
                  chapterTitle={item.currentChapter.title}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
