import { useEffect, useState } from "react";
import { mangaService } from "@/services/manga.service";
import { MangaCard } from "@/components/common/MangaCard";
import { userService } from "@/services/user.service";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import type { Manga } from "@/types/manga";

interface FavoriteMangaListProps {
  followedMangaIds: string[];
}

export const FavoriteMangaList = ({
  followedMangaIds,
}: FavoriteMangaListProps) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchFollowedMangas = async () => {
      if (followedMangaIds?.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch manga details for each followed manga ID
        const mangaPromises = followedMangaIds.map((id) =>
          mangaService.getMangaById(id).catch(() => null)
        );
        const mangaResults = await Promise.all(mangaPromises);
        const validMangas = mangaResults
          .filter((result) => result)
          .map((result) => result!);
        setMangas(validMangas);
      } catch (error) {
        console.error("Failed to fetch followed mangas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedMangas();
  }, [followedMangaIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Truyện yêu thích
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
                  ? `Bỏ theo dõi ${pendingIds.length}`
                  : "Bỏ theo dõi đã chọn"
              }
            >
              <UserMinus className="size-4" />
            </Button>

            <ConfirmationModal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title={`Bỏ theo dõi ${pendingIds.length} truyện?`}
              message={`Bạn có chắc muốn bỏ theo dõi ${pendingIds.length} truyện đã chọn? Hành động này có thể không phục hồi.`}
              confirmText="Xác nhận"
              cancelText="Hủy"
              variant="danger"
              loading={bulkLoading}
              onConfirm={async () => {
                try {
                  setBulkLoading(true);
                  await userService.unfollowMangaBatch(pendingIds);
                  setMangas((prev) =>
                    prev.filter((m) => !pendingIds.includes(m._id || ""))
                  );
                  setSelectedIds({});
                  toast.success(`Đã bỏ theo dõi ${pendingIds.length} truyện.`);
                } catch (err) {
                  console.error("Failed to unfollow selected mangas:", err);
                  toast.error(
                    "Không thể bỏ theo dõi một số truyện. Vui lòng thử lại."
                  );
                } finally {
                  setBulkLoading(false);
                  setConfirmOpen(false);
                  setPendingIds([]);
                }
              }}
            />
          </>
        </div>
      </div>
      {!mangas ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào được theo dõi
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {mangas.map((manga) =>
            manga?._id ? (
              <div key={manga._id} className="relative">
                <div className="absolute z-0 left-3 top-3">
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
                    className="size-4"
                  />
                </div>
                <MangaCard
                  manga={manga}
                  isFollowed={true}
                  onToggleFollow={async (mangaId, follow) => {
                    try {
                      if (follow) {
                        await userService.followManga({ mangaId });
                        toast.success("Đã theo dõi truyện");
                      } else {
                        await userService.unfollowManga(mangaId);
                        setMangas((prev) =>
                          prev.filter((m) => m._id !== mangaId)
                        );
                        setSelectedIds((prev) => {
                          const next = { ...prev };
                          delete next[mangaId];
                          return next;
                        });
                        toast.success("Đã bỏ theo dõi truyện");
                      }
                    } catch (err) {
                      console.error("Failed to toggle follow:", err);
                      toast.error("Thao tác thất bại. Vui lòng thử lại.");
                      throw err;
                    }
                  }}
                />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};
