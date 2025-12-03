import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { AIGetMangaRequest, AIGetMangaResponse } from "@/types";

export const aiService = {
  /**
   * Lấy danh sách truyện đề xuất theo mô tả của người dùng
   * Validation: description phải từ 10-500 ký tự
   */
  getMangaByDescription: async (
    data: AIGetMangaRequest
  ): Promise<AIGetMangaResponse> => {
    // Validate trước khi gửi request
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("Mô tả không được để trống");
    }
    if (data.description.trim().length < 10) {
      throw new Error("Mô tả phải có ít nhất 10 ký tự");
    }
    if (data.description.trim().length > 500) {
      throw new Error("Mô tả không được vượt quá 500 ký tự");
    }

    return axiosInstance.post(API_ENDPOINTS.AI.GET_MANGA, {
      description: data.description.trim(),
    });
  },

  /**
   * Generate manga recommendations (alternative endpoint)
   */
  generateManga: async (
    data: AIGetMangaRequest
  ): Promise<AIGetMangaResponse> => {
    // Validate trước khi gửi request
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("Mô tả không được để trống");
    }
    if (data.description.trim().length < 10) {
      throw new Error("Mô tả phải có ít nhất 10 ký tự");
    }
    if (data.description.trim().length > 500) {
      throw new Error("Mô tả không được vượt quá 500 ký tự");
    }

    return axiosInstance.post(API_ENDPOINTS.AI.GENERATE_MANGA, {
      description: data.description.trim(),
    });
  },
};
