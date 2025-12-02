import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Comment,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/types";

export const commentService = {
  /**
   * Tạo bình luận mới
   */
  createComment: async (
    data: CreateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    return axiosInstance.post(API_ENDPOINTS.COMMENT.CREATE, data);
  },

  /**
   * Lấy bình luận của một bộ truyện
   */
  getCommentsByMangaId: async (
    mangaId: string
  ): Promise<ApiResponse<CommentListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.COMMENT.BY_MANGA(mangaId));
  },

  /**
   * Lấy bình luận của một chapter
   */
  getCommentsByChapterId: async (
    chapterId: string
  ): Promise<ApiResponse<CommentListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.COMMENT.BY_CHAPTER(chapterId));
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
