import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  User,
  UpdateProfileRequest,
  FollowMangaRequest,
  UserQueryParams,
  AdminUpdateUserRequest,
} from "@/types/user";
import type { Manga } from "@/types/manga";
import type { UserListResponse } from "@/types/api";

export const userService = {
  /**
   * Lấy profile của user hiện tại
   */
  getMyProfile: async (): Promise<User> => {
    return axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
  },

  /**
   * Cập nhật hồ sơ người dùng
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  /**
   * Xóa tài khoản
   */
  deleteProfile: async (): Promise<void> => {
    return axiosInstance.delete(API_ENDPOINTS.USER.DELETE_PROFILE);
  },

  /**
   * Theo dõi một bộ truyện
   */
  followManga: async (data: FollowMangaRequest): Promise<void> => {
    return axiosInstance.post(API_ENDPOINTS.USER.FOLLOW, data);
  },

  /**
   * Bỏ theo dõi một bộ truyện
   */
  unfollowManga: async (mangaId: string): Promise<void> => {
    return axiosInstance.post(API_ENDPOINTS.USER.UNFOLLOW, { mangaId });
  },

  /**
   * Bỏ theo dõi nhiều bộ truyện cùng lúc
   */
  unfollowMangaBatch: async (mangaIds: string[]): Promise<void> => {
    return axiosInstance.post(API_ENDPOINTS.USER.UNFOLLOW_BATCH, { mangaIds });
  },

  /**
   * Lấy reading history
   */
  getReadingHistory: async (): Promise<Manga[]> => {
    return axiosInstance.get(API_ENDPOINTS.USER.READING_HISTORY);
  },

  /**
   * Cập nhật reading history
   */
  updateReadingHistory: async (data: {
    manga: string;
    chapterId: string;
  }): Promise<void> => {
    return axiosInstance.post(API_ENDPOINTS.USER.READING_HISTORY, data);
  },

  /**
   * Lấy danh sách manga đã upload (cho uploader)
   */
  getUploadedMangas: async (): Promise<Manga[]> => {
    return axiosInstance.get(API_ENDPOINTS.USER.UPLOADED_MANGAS);
  },

  /**
   * Lấy danh sách manga đã theo dõi
   */
  getFollowedMangas: async (): Promise<Manga[]> => {
    return axiosInstance.get(API_ENDPOINTS.USER.FOLLOWED_MANGAS);
  },

  getUsers: async (params?: UserQueryParams): Promise<UserListResponse> => {
    return axiosInstance.get(API_ENDPOINTS.USER.GET_USERS, { params });
  },

  /**
   * Admin: Lấy thông tin chi tiết một người dùng
   */
  adminGetUser: async (userId: string): Promise<User> => {
    return axiosInstance.get(API_ENDPOINTS.USER.ADMIN_GET_USER, {
      params: { userId },
    });
  },

  /**
   * Admin: Cập nhật thông tin người dùng
   */
  adminUpdateUser: async (data: AdminUpdateUserRequest): Promise<User> => {
    return axiosInstance.put(API_ENDPOINTS.USER.ADMIN_UPDATE_USER, data);
  },

  /**
   * Admin: Xóa người dùng
   */
  adminDeleteUser: async (userId: string): Promise<void> => {
    return axiosInstance.delete(API_ENDPOINTS.USER.ADMIN_DELETE_USER, {
      data: { userId },
    });
  },
};
