import type { Genre } from "./genre";
import type { User } from "./user";

// ========== Manga Types ==========

export interface Manga {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  artist?: string;
  genres: Genre[] | string[];
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  uploaderId?: string | User;
  viewCount?: number;
  followedCount?: number;
  averageRating?: number;
  chapterCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMangaRequest {
  title: string;
  description: string;
  author: string;
  artist?: string;
  genres: string[]; // Array of genre IDs
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  coverImageUrl: File | string;
}

export interface UpdateMangaRequest {
  title?: string;
  description?: string;
  author?: string;
  artist?: string;
  genres?: string[];
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  coverImageUrl?: File | string;
}

export interface MangaQueryParams {
  page?: number;
  limit?: number;
  genre?: string;
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  search?: string;
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
