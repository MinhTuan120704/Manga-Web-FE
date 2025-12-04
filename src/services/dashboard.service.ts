import { userService } from "./user.service";
import { mangaService } from "./manga.service";
import { chapterService } from "./chapter.service";
import type { DashboardData, DashboardStats, MangaWithChapters, Manga, Chapter, ApiResponse } from "@/types";

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
        chapterService.getChapterCountByUploader(),
      ]);

      console.log("📦 Mangas Response:", mangasResponse);
      console.log("📖 Chapter Count Response:", chapterCountResponse);

      // ✅ FIX: Type-safe extraction với proper type checking
      let mangas: Manga[] = [];
      
      // Handle different response structures
      if (Array.isArray(mangasResponse)) {
        // Case 1: Response trực tiếp là array
        mangas = mangasResponse;
        console.log("📚 Case 1: Direct array");
      } else if (mangasResponse && typeof mangasResponse === 'object') {
        // Case 2: Response có structure {data: ...}
        const responseData = mangasResponse as ApiResponse<Manga[] | { mangas: Manga[] }>;
        
        if (responseData.data) {
          if (Array.isArray(responseData.data)) {
            // Case 2a: {data: [...]}
            mangas = responseData.data;
            console.log("📚 Case 2a: data is array");
          } else if (responseData.data && typeof responseData.data === 'object' && 'mangas' in responseData.data) {
            // Case 2b: {data: {mangas: [...]}
            mangas = responseData.data.mangas;
            console.log("📚 Case 2b: data.mangas is array");
          }
        }
      }

      console.log("📚 Extracted mangas:", mangas);
      console.log("📚 Total mangas:", mangas.length);

      const chapterCountData = chapterCountResponse.data;

      // 2. Fetch chapters cho mỗi manga (parallel)
      const mangasWithChapters: MangaWithChapters[] = await Promise.all(
        mangas.map(async (manga) => {
          try {
            const chaptersResponse = await mangaService.getChaptersByMangaId(manga._id);
            
            // ✅ FIX: Type-safe chapters extraction
            let chapters: Chapter[] = [];
            
            if (Array.isArray(chaptersResponse)) {
              chapters = chaptersResponse;
            } else if (chaptersResponse && typeof chaptersResponse === 'object') {
              const chapterData = chaptersResponse as ApiResponse<Chapter[]>;
              if (chapterData.data && Array.isArray(chapterData.data)) {
                chapters = chapterData.data;
              }
            }
            
            console.log(`📖 Manga "${manga.title}": ${chapters.length} chapters`);
            
            // Sort chapters by number descending
            const sortedChapters = [...chapters].sort(
              (a, b) => b.chapterNumber - a.chapterNumber
            );

            return {
              ...manga,
              chapters,
              latestChapter: sortedChapters[0] || undefined,
            };
          } catch (error) {
            console.error(`❌ Failed to fetch chapters for manga ${manga._id}:`, error);
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
        avgRating: mangasWithChapters.length > 0
          ? mangasWithChapters.reduce(
              (sum, manga) => sum + (manga.averageRating || 0),
              0
            ) / mangasWithChapters.length
          : 0,
      };

      console.log("📊 Dashboard stats:", stats);

      // 4. Get recently updated mangas
      const recentlyUpdated = [...mangasWithChapters]
        .filter(manga => {
          const hasLatestChapter = !!manga.latestChapter;
          console.log(`🔍 "${manga.title}": hasLatestChapter=${hasLatestChapter}`);
          return hasLatestChapter;
        })
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
        popularMangasCount: result.popularMangas.length
      });

      return result;
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
      throw error;
    }
  },
};