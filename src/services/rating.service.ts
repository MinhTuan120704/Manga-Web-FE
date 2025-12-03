import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  RatingRequest,
  RatingResponse,
  UserRatingResponse,
  Rating,
} from "@/types";

export const ratingService = {
  /**
   * Đánh giá manga hoặc cập nhật đánh giá (1-5 sao)
   * Returns the created/updated rating object
   */
  rateManga: async (data: RatingRequest): Promise<Rating> => {
    return axiosInstance.post(API_ENDPOINTS.RATING.RATE, data);
  },

  /**
   * Lấy điểm đánh giá trung bình của manga
   */
  getMangaAverageRating: async (mangaId: string): Promise<RatingResponse> => {
    return axiosInstance.get(API_ENDPOINTS.RATING.MANGA_AVERAGE(mangaId));
  },

  /**
   * Lấy đánh giá của user hiện tại cho manga
   */
  getUserRatingForManga: async (
    mangaId: string
  ): Promise<UserRatingResponse> => {
    return axiosInstance.get(API_ENDPOINTS.RATING.USER_RATING(mangaId));
  },
};
