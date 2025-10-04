import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { AIGetMangaRequest, AIGetMangaResponse } from "@/types";

export const aiService = {
  /**
   * Lấy danh sách truyện theo mô tả của người dùng
   * Yêu cầu: Reader role
   */
  getMangaByDescription: async (
    data: AIGetMangaRequest
  ): Promise<AIGetMangaResponse> => {
    return axiosInstance.post(API_ENDPOINTS.AI.GET_MANGA, data);
  },
};
