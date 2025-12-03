import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { mangaService } from "@/services/manga.service";
import { MangaCard } from "@/components/common/MangaCard";
import type { Manga, ReadingHistoryItem } from "@/types";

export const FavoriteMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedMangas = async () => {
      try {
        // Get reading history which contains manga references
        const response = await userService.getReadingHistory();

        // API returns array directly without data wrapper
        let readingHistory: ReadingHistoryItem[] = [];

        if (Array.isArray(response)) {
          // Response is directly an array (axios already extracted data)
          readingHistory = response;
        } else if (Array.isArray(response.data)) {
          // Data is in response.data
          readingHistory = response.data;
        } else if (response.data?.readingHistory) {
          // Data is nested in readingHistory property
          readingHistory = response.data.readingHistory;
        }

        const mangaIds = Array.from(
          new Set(readingHistory.map((item: ReadingHistoryItem) => item.manga))
        ) as string[];

        console.log("Manga IDs:", mangaIds);

        // Fetch manga details for each unique manga
        if (mangaIds.length > 0) {
          const mangaPromises = mangaIds.map((id) =>
            mangaService.getMangaById(id).catch(() => null)
          );
          const mangaResults = await Promise.all(mangaPromises);
          const validMangas = mangaResults
            .filter((result) => result?.data)
            .map((result) => result!.data!);
          setMangas(validMangas);
        }
      } catch (error) {
        console.error("Failed to fetch reading history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedMangas();
  }, []);

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
        Truyện đã đọc gần đây
      </h2>
      {mangas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào được đọc gần đây
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {mangas.map((manga) => (
            <MangaCard key={manga._id} manga={manga} />
          ))}
        </div>
      )}
    </div>
  );
};
