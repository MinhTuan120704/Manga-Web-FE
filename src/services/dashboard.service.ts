import { userService } from "./user.service";
import { mangaService } from "./manga.service";
import { chapterService } from "./chapter.service"; // 🆕 Import chapter service
import type {
  DashboardData,
  DashboardStats,
  MangaWithChapters,
  Manga,
  Chapter,
} from "@/types";

interface ChapterCountData {
  uploaderId: string;
  totalChapters: number;
  totalMangas: number;
}

export const dashboardService = {
  /**
   * Fetch toàn bộ dữ liệu cho dashboard
   */
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      // 1. Fetch song song: mangas và chapter count
      const [mangasResponse, chapterCountResponse] = await Promise.all([
        userService.getUploadedMangas(),
        chapterService.getChapterCountByUploader(), // 🆕 Fetch từ API
      ]);
      const mangas: Manga[] = mangasResponse || [];
      const chapterCountData = chapterCountResponse as ChapterCountData;

      console.log("Chapter count from API:", chapterCountData);

      // 2. Fetch chapters cho mỗi manga (parallel) - để lấy latest chapter
      const mangasWithChapters: MangaWithChapters[] = await Promise.all(
        mangas.map(async (manga) => {
          try {
            const chaptersResponse = await mangaService.getChaptersByMangaId(
              manga._id
            );
            const chapters: Chapter[] = chaptersResponse || [];

            // Sort chapters by number descending để lấy latest
            const sortedChapters = [...chapters].sort(
              (a, b) => b.chapterNumber - a.chapterNumber
            );

            return {
              ...manga,
              chapters,
              latestChapter: sortedChapters[0] || undefined,
            };
          } catch (error) {
            console.error(
              `Failed to fetch chapters for manga ${manga._id}:`,
              error
            );
            return {
              ...manga,
              chapters: [],
              latestChapter: undefined,
            };
          }
        })
      );

      // 3. Calculate statistics - SỬ DỤNG DỮ LIỆU TỪ API
      const stats: DashboardStats = {
        totalMangas: chapterCountData?.totalMangas || mangas.length, // 🆕 Từ API
        totalChapters: chapterCountData?.totalChapters || 0, // 🆕 Từ API (chính xác hơn)
        totalViews: mangasWithChapters.reduce(
          (sum, manga) => sum + (manga.viewCount || 0),
          0
        ),
        totalFollowers: mangasWithChapters.reduce(
          (sum, manga) => sum + (manga.followedCount || 0),
          0
        ),
        avgRating:
          mangasWithChapters.length > 0
            ? mangasWithChapters.reduce(
                (sum, manga) => sum + (manga.averageRating || 0),
                0
              ) / mangasWithChapters.length
            : 0,
      };

      console.log("Dashboard stats:", stats);

      // 4. Get recently updated mangas (có chapters mới nhất)
      const recentlyUpdated = [...mangasWithChapters]
        .filter((manga) => manga.latestChapter)
        .sort((a, b) => {
          const dateA = a.latestChapter?.createdAt || a.updatedAt;
          const dateB = b.latestChapter?.createdAt || b.updatedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 5);

      // 5. Get popular mangas (sorted by views)
      const popularMangas = [...mangasWithChapters]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);

      return {
        mangas: mangasWithChapters,
        stats,
        recentlyUpdated,
        popularMangas,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw error;
    }
  },
};
