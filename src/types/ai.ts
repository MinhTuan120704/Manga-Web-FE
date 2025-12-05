// ========== AI Types ==========

export interface AIGetMangaRequest {
  description: string;
}

export interface AIRecommendation {
  title: string;
  description: string;
  genres: string[];
  suggestedAuthor: string;
  estimatedChapters: number;
}

export interface AIGetMangaResponse {
  status: string;
  recommendations: AIRecommendation[];
}
