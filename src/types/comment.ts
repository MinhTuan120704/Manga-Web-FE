import type { User } from "./user";

// ========== Comment & Rating Types ==========

export interface Comment {
  _id: string;
  manga?: string | { _id: string; title: string };
  chapter?: string | { _id: string; title: string; chapterNumber: number };
  user: string | User; // Changed from userId to user to match API response
  content: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  manga?: string;
  chapter?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface Rating {
  _id?: string;
  userId?: string;
  user?: string;
  manga?: string;
  star: number;
  createdAt: string;
}

export interface RatingRequest {
  manga: string;
  star: number;
}

export interface RatingResponse {
  averageRating: number;
  totalRatings: number;
}

export interface UserRatingResponse {
  rating: Rating | null;
}

// ========== Report Types ==========

export interface Report {
  _id: string;
  mangaId: string;
  userId: string | User;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  reason: string;
}

export interface ReportListResponse {
  status: string;
  data: Report[];
}

// ========== Statistics Types ==========

export interface BasicStatistics {
  users: {
    total: number;
    uploaders: number;
    readers: number;
    admins: number;
  };
  mangas: {
    total: number;
  };
  reports: {
    total: number;
  };
}

export interface DetailedStatistics {
  users: {
    total: number;
    uploaders: number;
    readers: number;
    admins: number;
  };
  mangas: {
    total: number;
    totalViewCount: number;
    ongoing: number;
    completed: number;
    hiatus: number;
    topGenres: Array<{
      name: string;
      count: number;
    }>;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
  };
}

// Note: CommentListResponse is defined in api.ts to avoid duplicate exports
