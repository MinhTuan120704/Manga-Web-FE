import { useEffect, useState } from "react";
import { mangaService } from "@/services/manga.service";
import { MangaCard } from "@/components/common/MangaCard";
import type { Manga } from "@/types/manga";

interface FavoriteMangaListProps {
  followedMangaIds: string[];
}

export const FavoriteMangaList = ({
  followedMangaIds,
}: FavoriteMangaListProps) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Truyện yêu thích
      </h2>
      {!mangas ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào được theo dõi
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {mangas.map(
            (manga) => manga?._id && <MangaCard key={manga._id} manga={manga} />
          )}
        </div>
      )}
    </div>
  );
};
