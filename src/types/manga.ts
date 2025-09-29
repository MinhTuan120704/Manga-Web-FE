export interface Manga {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  author: string;
  artist?: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  genres: string[];
  rating: number;
  chapters: number;
  updatedAt: string;
  tags: string[];
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  publishedAt: string;
  pages: number;
}

export interface RecentUpdate {
  manga: Manga;
  chapter: Chapter;
  timeAgo: string;
}

export interface PopularManga {
  manga: Manga;
  views: number;
  rank: number;
}

export interface FeaturedManga extends Manga {
  featured: boolean;
  featuredReason: string;
}
