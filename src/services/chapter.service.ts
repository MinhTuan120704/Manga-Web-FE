import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  Chapter,
  CreateChapterRequest,
  UpdateChapterRequest,
  ChapterCountResponse,
} from "@/types/chapter";

export const chapterService = {
  /**
   * Lấy chi tiết một chương (để đọc)
   */
  getChapterById: async (chapterId: string): Promise<Chapter> => {
    return axiosInstance.get(API_ENDPOINTS.CHAPTER.DETAIL(chapterId));
  },

  /**
   * Tải lên chương mới cho truyện (Uploader, Admin)
   */
  createChapter: async (
    mangaId: string,
    data: CreateChapterRequest
  ): Promise<Chapter> => {
    const formData = new FormData();
    formData.append("chapterNumber", data.chapterNumber.toString());
    formData.append("title", data.title);

    // Append pages (image files)
    data.pages.forEach((page, index) => {
      const paddedIndex = String(index + 1).padStart(2, "0");
      formData.append("pages", page, `page_${paddedIndex}.jpg`);
    });

    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    return axiosInstance.post(API_ENDPOINTS.CHAPTER.CREATE(mangaId), formData, {
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
  ): Promise<Chapter> => {
    const formData = new FormData();

    if (data.chapterNumber !== undefined) {
      formData.append("chapterNumber", data.chapterNumber.toString());
    }
    if (data.title) {
      formData.append("title", data.title);
    }
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }
    if (data.pagesToDelete && data.pagesToDelete.length > 0) {
      formData.append("pagesToDelete", JSON.stringify(data.pagesToDelete));
    }
    if (data.newPages && data.newPages.length > 0) {
      data.newPages.forEach((page, index) => {
        const paddedIndex = String(index + 1).padStart(2, "0");
        formData.append("pages", page, `page_${paddedIndex}.jpg`);
      });
    }

    return axiosInstance.put(API_ENDPOINTS.CHAPTER.UPDATE(chapterId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Xóa chương (Admin, Uploader)
   */
  deleteChapter: async (chapterId: string): Promise<void> => {
    return axiosInstance.delete(API_ENDPOINTS.CHAPTER.DELETE(chapterId));
  },

  getChapterCountByUploader: async (): Promise<ChapterCountResponse> => {
    return axiosInstance.get(API_ENDPOINTS.CHAPTER.COUNT_BY_UPLOADER);
  },
};
