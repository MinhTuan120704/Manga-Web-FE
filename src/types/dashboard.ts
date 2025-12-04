import type { Manga } from "./manga";
import type { Chapter } from "./chapter";

export interface DashboardStats {
  totalMangas: number;
  totalChapters: number;
  totalViews: number;
  totalFollowers: number;
  avgRating: number;
}

export interface MangaWithChapters extends Manga {
  chapters: Chapter[];
  latestChapter?: Chapter;
}

export interface DashboardData {
  mangas: MangaWithChapters[];
  stats: DashboardStats;
  recentlyUpdated: MangaWithChapters[];
  popularMangas: MangaWithChapters[];
}
