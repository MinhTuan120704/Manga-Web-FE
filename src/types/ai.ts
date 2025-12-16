// ========== AI Types ==========

export interface AIGetMangaRequest {
  description: string;
}

export interface RecommendedManga {
  id: string;
  name: string;
  reason: string;
}

export interface AIGetMangaResponse {
  suggestedGenres: string[];
  recommendedMangas: RecommendedManga[];
}
