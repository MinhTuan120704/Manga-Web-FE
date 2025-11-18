import type { User } from "./user";

// ========== Chapter Types ==========

export interface Page {
  pageNumber: number;
  image: string;
}

// Manga reference when populated
export interface MangaReference {
  _id: string;
  title: string;
}

export interface Chapter {
  _id: string;
  mangaId: string | MangaReference;
  chapterNumber: number;
  title: string;
  pages: Page[];
  thumbnail?: string;
  uploaderId?: string | User;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateChapterRequest {
  chapterNumber: number;
  title: string;
  pages: File[];
}

export interface UpdateChapterRequest {
  chapterNumber?: number;
  title?: string;
  pages?: Page[];
}

import type { Manga } from "./manga";

export interface RecentUpdate {
  manga: Manga;
  chapter: Chapter;
  timeAgo: string;
}
