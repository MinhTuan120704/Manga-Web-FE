// ========== AI Types ==========

export interface AIGetMangaRequest {
  description: string;
}

export interface AIGetMangaResponse {
  suggestedGenres: string[];
  recommendedMangas: {
    id: string;
    name: string;
    reason: string;
  }[];
}
