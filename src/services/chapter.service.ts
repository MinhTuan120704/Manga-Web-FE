import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
} from "@/types";

export const chapterService = {
  /**
   * Lấy chi tiết một chương (để đọc)
   */
  getChapterById: async (chapterId: string): Promise<ApiResponse<Chapter>> => {
    return axiosInstance.get(API_ENDPOINTS.CHAPTER.DETAIL(chapterId));
  },

  /**
   * Tải lên chương mới cho truyện (Uploader, Admin)
   */
  createChapter: async (
    mangaId: string,
    data: CreateChapterRequest
  ): Promise<ApiResponse<Chapter>> => {
    const formData = new FormData();
    formData.append("chapterNumber", data.chapterNumber.toString());
    formData.append("title", data.title);

    // Append pages (image files)
    data.pages.forEach((page, index) => {
      // Đặt tên file theo format page_01.jpg, page_02.jpg, ...
      const paddedIndex = String(index + 1).padStart(2, "0");
      formData.append("pages", page, `page_${paddedIndex}.jpg`);
    });

    return axiosInstance.post(API_ENDPOINTS.MANGA.CHAPTERS(mangaId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Cập nhật thông tin chương (Admin, Uploader)
   */
  updateChapter: async (
    chapterId: string,
    data: UpdateChapterRequest
  ): Promise<ApiResponse<Chapter>> => {
    return axiosInstance.put(API_ENDPOINTS.CHAPTER.UPDATE(chapterId), data);
  },

  /**
   * Xóa chương (Admin, Uploader)
   */
  deleteChapter: async (chapterId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.CHAPTER.DELETE(chapterId));
  },
};
