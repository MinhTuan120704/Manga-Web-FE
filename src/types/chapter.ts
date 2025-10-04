import type { User } from "./user";

// ========== Chapter Types ==========

export interface Page {
  pageNumber: number;
  image: string; 
}

export interface Chapter {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  pages: Page[];
  uploaderId?: string | User; 
  createdAt: string;
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
