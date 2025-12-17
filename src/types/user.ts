// ========== User Types ==========

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: "reader" | "uploader" | "admin";
  avatarUrl?: string;
  followedMangas?: string[];
  readingHistory?: ReadingHistoryItem[];
  uploadedMangas?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReadingHistoryItem {
  _id?: string;
  manga: string;
  chapterId: string;
  lastReadAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface FollowMangaRequest {
  mangaId: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: "reader" | "uploader" | "admin";
  search?: string;
}

export interface AdminUpdateUserRequest {
  userId: string;
  username?: string;
  email?: string;
  role?: "reader" | "uploader" | "admin";
  avatarUrl?: string;
}

export interface AdminDeleteUserRequest {
  userId: string;
}
