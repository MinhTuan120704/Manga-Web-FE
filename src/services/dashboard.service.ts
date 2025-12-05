import { userService } from "./user.service";
import { mangaService } from "./manga.service";
import { chapterService } from "./chapter.service"; // 🆕 Import chapter service
import type {
  DashboardData,
  DashboardStats,
  MangaWithChapters,
} from "@/types/dashboard";
import type { Manga } from "@/types/manga";
import type { Chapter } from "@/types/chapter";

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
      console.log("🚀 Starting dashboard data fetch...");

      // 1. Fetch song song: mangas và chapter count
      const [mangasResponse, chapterCountResponse] = await Promise.all([
        userService.getUploadedMangas(),
        chapterService.getChapterCountByUploader(), // 🆕 Fetch từ API
      ]);
      const mangas: Manga[] = mangasResponse || [];
      const chapterCountData = chapterCountResponse as ChapterCountData;

      // 2. Fetch chapters cho mỗi manga (parallel)
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

      console.log("📦 Mangas with chapters:", mangasWithChapters.length);

      // 3. Calculate statistics
      const stats: DashboardStats = {
        totalMangas: chapterCountData?.totalMangas || mangas.length,
        totalChapters: chapterCountData?.totalChapters || 0,
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

      console.log("📊 Dashboard stats:", stats);

      // 4. Get recently updated mangas
      const recentlyUpdated = [...mangasWithChapters]
        .filter((manga) => manga.latestChapter)
        .sort((a, b) => {
          const dateA = a.latestChapter?.createdAt || a.updatedAt;
          const dateB = b.latestChapter?.createdAt || b.updatedAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 5);

      console.log("🆕 Recently updated:", recentlyUpdated.length);

      // 5. Get popular mangas
      const popularMangas = [...mangasWithChapters]
        .sort((a, b) => {
          const viewsA = a.viewCount || 0;
          const viewsB = b.viewCount || 0;
          return viewsB - viewsA;
        })
        .slice(0, 5);

      console.log("🔥 Popular mangas:", popularMangas.length);

      const result = {
        mangas: mangasWithChapters,
        stats,
        recentlyUpdated,
        popularMangas,
      };

      console.log("✅ Final dashboard data:", {
        totalMangas: result.mangas.length,
        recentlyUpdatedCount: result.recentlyUpdated.length,
        popularMangasCount: result.popularMangas.length,
      });

      return result;
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
      throw error;
    }
  },
};
