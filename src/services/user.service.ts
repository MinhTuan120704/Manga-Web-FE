import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Manga,
  User,
  UpdateProfileRequest,
  FollowMangaRequest,
} from "@/types";

export const userService = {
  /**
   * Lấy profile của user hiện tại
   */
  getMyProfile: async (): Promise<ApiResponse<User>> => {
    return axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
  },

  /**
   * Cập nhật hồ sơ người dùng
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    return axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  /**
   * Xóa tài khoản
   */
  deleteProfile: async (): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.USER.DELETE_PROFILE);
  },

  /**
   * Theo dõi một bộ truyện
   */
  followManga: async (data: FollowMangaRequest): Promise<ApiResponse<void>> => {
    return axiosInstance.post(API_ENDPOINTS.USER.FOLLOW, data);
  },

  /**
   * Bỏ theo dõi một bộ truyện
   */
  unfollowManga: async (mangaId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.post(API_ENDPOINTS.USER.UNFOLLOW, { mangaId });
  },

  /**
   * Lấy reading history
   */
  getReadingHistory: async (): Promise<ApiResponse<any>> => {
    return axiosInstance.get(API_ENDPOINTS.USER.READING_HISTORY);
  },

  /**
   * Cập nhật reading history
   */
  updateReadingHistory: async (data: {
    manga: string;
    chapterId: string;
  }): Promise<ApiResponse<void>> => {
    return axiosInstance.post(API_ENDPOINTS.USER.READING_HISTORY, data);
  },

  /**
   * Lấy danh sách manga đã upload (cho uploader)
   */
  getUploadedMangas: async (): Promise<ApiResponse<Manga[]>> => {
    return axiosInstance.get(API_ENDPOINTS.USER.UPLOADED_MANGAS);
  },
};
