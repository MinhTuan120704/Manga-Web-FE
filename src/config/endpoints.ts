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
    DETAIL: (id: string) => `/chapters/${id}`,
    UPDATE: (id: string) => `/chapters/${id}`,
    DELETE: (id: string) => `/chapters/${id}`,
  },

  // ========== User ==========
  USER: {
    ME: "/users/me",
    UPDATE_PROFILE: "/users/me",
    FOLLOW: "/users/me/follow",
    FOLLOWED_MANGAS: "/users/me/follow",
    UNFOLLOW: (mangaId: string) => `/users/me/follow/${mangaId}`,
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
