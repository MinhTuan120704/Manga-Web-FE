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
  followerCount?: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
  progress?: number;
  chapterCount?: number;
  followedCount?: number;
}

export interface CreateMangaRequest {
  title: string;
  description: string;
  author: string;
  artist?: string;
  genres: string[]; // Array of genre IDs
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  coverImage: File;
}

export interface UpdateMangaRequest {
  title?: string;
  description?: string;
  author?: string;
  artist?: string;
  genres?: string[];
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  coverImage?: File | string;
}

export interface MangaQueryParams {
  page?: number;
  limit?: number;
  genre?: string;
  status?: "ongoing" | "completed" | "hiatus" | "cancelled";
  sortBy?: string;
  search?: string; // Search by title/description
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
