import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Manga,
  MangaListResponse,
  MangaQueryParams,
  ChapterListResponse,
  CreateMangaRequest,
  UpdateMangaRequest,
} from "@/types";

export const mangaService = {
  /**
   * Lấy danh sách truyện với phân trang, lọc, sắp xếp
   */
  getMangas: async (
    params?: MangaQueryParams
  ): Promise<ApiResponse<MangaListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.MANGA.LIST, { params });
  },

  /**
   * Lấy thông tin chi tiết một bộ truyện
   */
  getMangaById: async (mangaId: string): Promise<ApiResponse<Manga>> => {
    return axiosInstance.get(API_ENDPOINTS.MANGA.DETAIL(mangaId));
  },

  /**
   * Lấy danh sách chương của một bộ truyện
   */
  getChaptersByMangaId: async (
    mangaId: string
  ): Promise<ApiResponse<ChapterListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.MANGA.CHAPTERS(mangaId));
  },

  /**
   * Đăng truyện mới (Uploader, Admin)
   */
  createManga: async (
    data: CreateMangaRequest
  ): Promise<ApiResponse<Manga>> => {
    // Nếu có file coverImageUrl, gửi dưới dạng FormData
    if (data.coverImageUrl instanceof File) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("author", data.author);
      if (data.artist) formData.append("artist", data.artist);
      formData.append("status", data.status);
      formData.append("coverImageUrl", data.coverImageUrl);

      // Append genres array
      data.genres.forEach((genre) => {
        formData.append("genres[]", genre);
      });

      return axiosInstance.post(API_ENDPOINTS.MANGA.CREATE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return axiosInstance.post(API_ENDPOINTS.MANGA.CREATE, data);
  },

  /**
   * Cập nhật thông tin truyện (Admin, Uploader)
   */
  updateManga: async (
    mangaId: string,
    data: UpdateMangaRequest
  ): Promise<ApiResponse<Manga>> => {
    // Nếu có file coverImageUrl, gửi dưới dạng FormData
    if (data.coverImageUrl instanceof File) {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.author) formData.append("author", data.author);
      if (data.artist) formData.append("artist", data.artist);
      if (data.status) formData.append("status", data.status);
      formData.append("coverImageUrl", data.coverImageUrl);

      if (data.genres) {
        data.genres.forEach((genre) => {
          formData.append("genres[]", genre);
        });
      }

      return axiosInstance.put(API_ENDPOINTS.MANGA.UPDATE(mangaId), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return axiosInstance.put(API_ENDPOINTS.MANGA.UPDATE(mangaId), data);
  },

  /**
   * Xóa truyện (Admin, Uploader)
   */
  deleteManga: async (mangaId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.MANGA.DELETE(mangaId));
  },
};
