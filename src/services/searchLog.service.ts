import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import { resetSessionId } from "@/lib/session";

export interface LogClickParams {
  query: string;
  mangaId: string;
  position?: number;
}

export const searchLogService = {
  /**
   * Log a click on search result for ML training data
   */
  logClick: async (params: LogClickParams): Promise<void> => {
    try {
      await axiosInstance.post(API_ENDPOINTS.SEARCH_LOG.CLICK, params);
      // Reset session after successful click to separate different search flows
      resetSessionId();
    } catch (error) {
      // Silent fail - don't interrupt user experience for analytics
      console.error("Failed to log search click:", error);
    }
  },
};
