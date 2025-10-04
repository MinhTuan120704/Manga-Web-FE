import type { User } from "./user";

// ========== Comment & Rating Types ==========

export interface Comment {
  _id: string;
  mangaId: string;
  userId: string | User;
  content: string;
  parentId?: string | null; 
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface Rating {
  userId: string;
  score: number;
  createdAt: string;
}

export interface RatingRequest {
  score: number; 
}
