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

export interface RecommendedManga extends Manga {
  uploader?: Pick<import("./user").User, "_id" | "username" | "avatarUrl">;
  rawCount?: number;
  __v?: number;
}

export interface RecommendationsResponse {
  manga: {
    _id: string;
    title: string;
  };
  recommendations: RecommendedManga[];
  totalRecommendations: number;
}

// ======= Pre-unwrap (raw) API response types for recommendations =======
export interface GenreBrief {
  _id: string;
  name: string;
}

export interface UploaderBrief {
  _id: string;
  username: string;
  avatarUrl?: string;
}

export interface RecommendationItem {
  _id: string;
  title: string;
  description?: string;
  author?: string;
  coverImage?: string;
  coverImageUrl?: string; // some responses may use this key
  genres: GenreBrief[];
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  uploaderId?: string | UploaderBrief;
  viewCount?: number;
  followedCount?: number;
  averageRating?: number;
  totalRatings?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  chapterCount?: number;
  progress?: number;
  rawCount?: number;
}

export interface RecommendationsRawData {
  manga: {
    _id: string;
    title: string;
  };
  recommendations: RecommendationItem[];
  totalRecommendations: number;
}

export interface RecommendationsApiResponse {
  status: string; // usually 'success'
  data: RecommendationsRawData;
}
