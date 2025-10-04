import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Comment,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  RatingRequest,
} from "@/types";

export const commentService = {
  /**
   * Lấy bình luận của một bộ truyện
   */
  getCommentsByMangaId: async (
    mangaId: string
  ): Promise<ApiResponse<CommentListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.MANGA.COMMENTS(mangaId));
  },

  /**
   * Gửi bình luận
   */
  createComment: async (
    mangaId: string,
    data: CreateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    return axiosInstance.post(API_ENDPOINTS.MANGA.COMMENTS(mangaId), data);
  },

  /**
   * Sửa bình luận
   */
  updateComment: async (
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    return axiosInstance.put(API_ENDPOINTS.COMMENT.UPDATE(commentId), data);
  },

  /**
   * Xóa bình luận
   */
  deleteComment: async (commentId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.COMMENT.DELETE(commentId));
  },
};

export const ratingService = {
  /**
   * Đánh giá truyện hoặc cập nhật đánh giá
   */
  rateManga: async (
    mangaId: string,
    data: RatingRequest
  ): Promise<ApiResponse<{ averageRating: number }>> => {
    return axiosInstance.post(API_ENDPOINTS.MANGA.RATINGS(mangaId), data);
  },

  /**
   * Xóa đánh giá
   */
  deleteRating: async (
    mangaId: string
  ): Promise<ApiResponse<{ averageRating: number }>> => {
    return axiosInstance.delete(API_ENDPOINTS.MANGA.RATINGS(mangaId));
  },
};
