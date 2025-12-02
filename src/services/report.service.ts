import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Report,
  ReportListResponse,
  CreateReportRequest,
} from "@/types";

export const reportService = {
  /**
   * Report một manga
   */
  createReport: async (
    mangaId: string,
    data: CreateReportRequest
  ): Promise<ApiResponse<Report>> => {
    return axiosInstance.post(API_ENDPOINTS.REPORT.CREATE(mangaId), data);
  },

  /**
   * Lấy tất cả reports (Admin only)
   */
  getAllReports: async (): Promise<ApiResponse<ReportListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.LIST);
  },

  /**
   * Lấy reports của một manga cụ thể (Admin only)
   */
  getReportsByMangaId: async (
    mangaId: string
  ): Promise<ApiResponse<ReportListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.BY_MANGA(mangaId));
  },

  /**
   * Lấy chi tiết một report (Admin only)
   */
  getReportById: async (reportId: string): Promise<ApiResponse<Report>> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.DETAIL(reportId));
  },
};
