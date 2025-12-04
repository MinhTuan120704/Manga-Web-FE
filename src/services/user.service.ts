import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { ApiResponse, MangaListResponse } from "@/types/api";
import type {
  FollowMangaRequest,
  UpdateProfileRequest,
  User,
  UserQueryParams,
} from "@/types/user";

export const userService = {
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

  getUsers: async (params?: UserQueryParams) => {
    return axiosInstance.get(API_ENDPOINTS.USER.GET_USERS, { params });
  },
};
