import type { Manga } from "./manga";
import type { Chapter } from "./chapter";
import type { Comment } from "./comment";
import type { Genre } from "./genre";
import type { User } from "./user";

// ========== API Response Types ==========

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  total: number; // Alias for totalItems
}

export interface MangaListResponse {
  mangas: Manga[];
  pagination: PaginationData;
}

export interface UserListResponse {
  users: User[];
  pagination: PaginationData;
}

export type ChapterListResponse = Chapter[];

export interface CommentListResponse {
  comments: Comment[];
}

export interface GenreListResponse {
  genres: Genre[];
}
