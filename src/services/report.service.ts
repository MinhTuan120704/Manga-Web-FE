import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  Report,
  ReportListResponse,
  CreateReportRequest,
} from "@/types/comment";

export const reportService = {
  /**
   * Report một manga
   */
  createReport: async (
    mangaId: string,
    data: CreateReportRequest
  ): Promise<Report> => {
    return axiosInstance.post(API_ENDPOINTS.REPORT.CREATE(mangaId), data);
  },

  /**
   * Lấy tất cả reports (Admin only)
   */
  getAllReports: async (): Promise<Report[]> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.LIST);
  },

  /**
   * Lấy reports của một manga cụ thể (Admin only)
   */
  getReportsByMangaId: async (mangaId: string): Promise<ReportListResponse> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.BY_MANGA(mangaId));
  },

  /**
   * Lấy chi tiết một report (Admin only)
   */
  getReportById: async (reportId: string): Promise<Report> => {
    return axiosInstance.get(API_ENDPOINTS.REPORT.DETAIL(reportId));
  },

  /**
   * Xóa một report (Admin only)
   */
  deleteReport: async (reportId: string): Promise<{ message: string }> => {
    return axiosInstance.delete(API_ENDPOINTS.REPORT.DELETE(reportId));
  },
};
