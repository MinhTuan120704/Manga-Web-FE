import { useEffect, useState } from "react";
import { mangaService } from "@/services/manga.service";
import { MangaCard } from "@/components/common/MangaCard";
import type { Manga } from "@/types/manga";
import type { ReadingHistoryItem } from "@/types/user";

interface MangaReadingHistoryProps {
  readingHistory: ReadingHistoryItem[];
}

export const MangaReadingHistory = ({
  readingHistory,
}: MangaReadingHistoryProps) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (readingHistory?.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Get unique manga IDs from reading history
        const mangaIds = Array.from(
          new Set(readingHistory.map((item) => item.manga))
        ) as string[];

        // Fetch manga details for each unique manga
        if (mangaIds.length > 0) {
          const mangaPromises = mangaIds.map((id) =>
            mangaService.getMangaById(id).catch(() => null)
          );
          const mangaResults = await Promise.all(mangaPromises);
          const validMangas = mangaResults
            .filter((result) => result)
            .map((result) => result!);
          setMangas(validMangas);
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

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Lịch sử đọc truyện
      </h2>
      {!mangas ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có lịch sử đọc truyện
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {mangas?.map(
            (manga) => manga?._id && <MangaCard key={manga._id} manga={manga} />
          )}
        </div>
      )}
    </div>
  );
};
