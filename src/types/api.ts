import type { Manga } from "./manga";
import type { Chapter } from "./chapter";
import type { Comment } from "./comment";
import type { Genre } from "./genre";

// ========== API Response Types ==========

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface MangaListResponse {
  mangas: Manga[];
  pagination: PaginationData;
}

export type ChapterListResponse = Chapter[];

export interface CommentListResponse {
  comments: Comment[];
}

export interface GenreListResponse {
  genres: Genre[];
}
