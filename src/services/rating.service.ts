import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  RatingRequest,
  RatingResponse,
  UserRatingResponse,
} from "@/types";

export const ratingService = {
  /**
   * Đánh giá manga hoặc cập nhật đánh giá (1-5 sao)
   */
  rateManga: async (
    data: RatingRequest & { manga: string }
  ): Promise<ApiResponse<RatingResponse>> => {
    return axiosInstance.post(API_ENDPOINTS.RATING.RATE, data);
  },

  /**
   * Lấy điểm đánh giá trung bình của manga
   */
  getMangaAverageRating: async (
    mangaId: string
  ): Promise<ApiResponse<RatingResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.RATING.MANGA_AVERAGE(mangaId));
  },

  /**
   * Lấy đánh giá của user hiện tại cho manga
   */
  getUserRatingForManga: async (
    mangaId: string
  ): Promise<ApiResponse<UserRatingResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.RATING.USER_RATING(mangaId));
  },
};
