import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { ApiResponse, Manga, User, UpdateProfileRequest, FollowMangaRequest, MangaListResponse } from "@/types";

export const userService = {
  /**
   * Lấy danh sách manga đã upload (cho uploader)
   */
  getUploadedMangas: async (): Promise<ApiResponse<Manga[]>> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.UPLOADED_MANGAS);

      // Backend có thể trả về trực tiếp array hoặc wrapped trong data
      // Normalize response
      if (Array.isArray(response)) {
        return {
          status: "success",
          data: response,
        };
      }

      return response;
    } catch (error) {
      console.error("Error fetching uploaded mangas:", error);
      throw error;
    }
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
   * Theo dõi một bộ truyện
   */
  followManga: async (data: FollowMangaRequest): Promise<ApiResponse<void>> => {
    return axiosInstance.post(API_ENDPOINTS.USER.FOLLOW, data);
  },

  /**
   * Lấy danh sách truyện đã theo dõi
   */
  getFollowedMangas: async (): Promise<ApiResponse<MangaListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.USER.FOLLOWED_MANGAS);
  },

  /**
   * Bỏ theo dõi một bộ truyện
   */
  unfollowManga: async (mangaId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.USER.UNFOLLOW(mangaId));
  },
};
