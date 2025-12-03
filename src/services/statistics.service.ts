import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { BasicStatistics, DetailedStatistics } from "@/types";

export const statisticsService = {
  /**
   * Lấy thống kê cơ bản của nền tảng
   */
  getBasicStatistics: async (): Promise<BasicStatistics> => {
    return axiosInstance.get(API_ENDPOINTS.STATISTICS.BASIC);
  },

  /**
   * Lấy thống kê chi tiết (Admin only)
   */
  getDetailedStatistics: async (): Promise<DetailedStatistics> => {
    return axiosInstance.get(API_ENDPOINTS.STATISTICS.DETAILED);
  },
};
