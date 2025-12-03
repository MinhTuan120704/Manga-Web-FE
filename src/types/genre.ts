// ========== Genre Types ==========

export interface Genre {
  _id: string;
  name: string;
  slug?: string; 
  description?: string;
  mangaCount?: number; 
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGenreRequest {
  name: string;
  description?: string;
}

export interface UpdateGenreRequest {
  name?: string;
  description?: string;
}

export interface GenreMangaQueryParams {
  page?: number;
  limit?: number;
}
