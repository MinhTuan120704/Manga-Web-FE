import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  Genre,
  GenreListResponse,
  CreateGenreRequest,
  UpdateGenreRequest,
  MangaListResponse,
  GenreMangaQueryParams,
} from "@/types";

export const genreService = {
  /**
   * Lấy danh sách tất cả thể loại (Public)
   */
  getGenres: async (): Promise<ApiResponse<GenreListResponse>> => {
    return axiosInstance.get(API_ENDPOINTS.GENRE.LIST);
  },

  /**
   * Tạo thể loại mới (Admin)
   */
  createGenre: async (
    data: CreateGenreRequest
  ): Promise<ApiResponse<Genre>> => {
    return axiosInstance.post(API_ENDPOINTS.GENRE.CREATE, data);
  },

  /**
   * Cập nhật một thể loại (Admin)
   */
  updateGenre: async (
    genreId: string,
    data: UpdateGenreRequest
  ): Promise<ApiResponse<Genre>> => {
    return axiosInstance.put(API_ENDPOINTS.GENRE.UPDATE(genreId), data);
  },

  /**
   * Xóa một thể loại (Admin)
   */
  deleteGenre: async (genreId: string): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(API_ENDPOINTS.GENRE.DELETE(genreId));
  },

  /**
   * Lấy danh sách truyện theo một thể loại
   */
  getMangasByGenre: async (
    slug: string,
    params?: GenreMangaQueryParams
  ): Promise<ApiResponse<MangaListResponse & { genre: Genre }>> => {
    return axiosInstance.get(API_ENDPOINTS.GENRE.MANGAS(slug), { params });
  },
};
