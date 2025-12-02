/**
 * API Endpoints Configuration
 */

export const API_ENDPOINTS = {
  // ========== Authentication ==========
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  // ========== Manga ==========
  MANGA: {
    LIST: "/mangas",
    DETAIL: (id: string) => `/mangas/${id}`,
    CREATE: "/mangas",
    UPDATE: (id: string) => `/mangas/${id}`,
    DELETE: (id: string) => `/mangas/${id}`,
    CHAPTERS: (id: string) => `/mangas/${id}/chapters`,
    COMMENTS: (id: string) => `/mangas/${id}/comments`,
    RATINGS: (id: string) => `/mangas/${id}/ratings`,
  },

  // ========== Chapter ==========
  CHAPTER: {
    DETAIL: (chapterId: string) => `/chapters/${chapterId}`,
    UPDATE: (chapterId: string) => `/chapters/${chapterId}`,
    DELETE: (chapterId: string) => `/chapters/${chapterId}`,
    COUNT_BY_UPLOADER: "/chapters/count/uploader", // 🆕 Add this
  },

  // ========== User ==========
  USER: {
    ME: "/users/me",
    UPDATE_PROFILE: "/users/me",
    PROFILE: "/users/profile",
    FOLLOW: "/users/me/follow",
    FOLLOWED_MANGAS: "/users/me/follow",
    UNFOLLOW: (mangaId: string) => `/users/me/follow/${mangaId}`,
    UNFOLLOW: "/users/unfollow",
    READING_HISTORY: "/users/reading-history",
    UPLOADED_MANGAS: "/users/uploaded-mangas", 
  },

  // ========== Comment ==========
  COMMENT: {
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
  },

  // ========== Genre ==========
  GENRE: {
    LIST: "/genres",
    CREATE: "/genres",
    UPDATE: (id: string) => `/genres/${id}`,
    DELETE: (id: string) => `/genres/${id}`,
    MANGAS: (slug: string) => `/genres/${slug}/mangas`,
  },

  // ========== AI ==========
  AI: {
    GET_MANGA: "/ai/get-manga",
  },
} as const;
