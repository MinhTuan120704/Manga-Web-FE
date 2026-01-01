/**
 * API Endpoints Configuration
 */

export const API_ENDPOINTS = {
  // ========== Authentication ==========
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    USER: "/auth/user",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // ========== Manga ==========
  MANGA: {
    LIST: "/mangas",
    SEARCH: "/mangas/search",
    RECOMMENDATIONS: (id: string) => `/mangas/${id}/recommendations`,
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
    CREATE: (mangaId: string) => `/chapters/${mangaId}`,
    UPDATE: (chapterId: string) => `/chapters/${chapterId}`,
    DELETE: (chapterId: string) => `/chapters/${chapterId}`,
    COUNT_BY_UPLOADER: "/chapters/count/uploader", // 🆕 Add this
  },

  // ========== User ==========
  USER: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    DELETE_PROFILE: "/users/profile",
    FOLLOW: "/users/follow",
    UNFOLLOW: "/users/unfollow",
    UNFOLLOW_BATCH: "/users/unfollow-batch",
    READING_HISTORY: "/users/reading-history",
    UPLOADED_MANGAS: "/users/uploaded-mangas",
    FOLLOWED_MANGAS: "/users/followed-mangas",
    GET_USERS: "/users",
    // Admin only
    ADMIN_GET_USER: "/users/admin/user",
    ADMIN_UPDATE_USER: "/users/admin/update",
    ADMIN_DELETE_USER: "/users/admin/delete",
  },

  // ========== Comment ==========
  COMMENT: {
    CREATE: "/comments",
    BY_MANGA: (mangaId: string) => `/comments/manga/${mangaId}`,
    BY_CHAPTER: (chapterId: string) => `/comments/chapter/${chapterId}`,
    BY_UPLOADER: "/comments/uploader",
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
  },

  // ========== Genre ==========
  GENRE: {
    LIST: "/genres",
    SEARCH: "/genres/search",
    CREATE: "/genres",
    UPDATE: (id: string) => `/genres/${id}`,
    DELETE: (id: string) => `/genres/${id}`,
    MANGAS: (slug: string) => `/genres/${slug}/mangas`,
  },

  // ========== Rating ==========
  RATING: {
    RATE: "/ratings",
    MANGA_AVERAGE: (mangaId: string) => `/ratings/manga/${mangaId}`,
    USER_RATING: (mangaId: string) => `/ratings/manga/${mangaId}/user`,
  },

  // ========== Report ==========
  REPORT: {
    CREATE: (mangaId: string) => `/reports/${mangaId}`,
    LIST: "/reports",
    BY_MANGA: (mangaId: string) => `/reports/manga/${mangaId}`,
    DETAIL: (reportId: string) => `/reports/${reportId}`,
    DELETE: (reportId: string) => `/reports/${reportId}`,
  },

  // ========== Statistics ==========
  STATISTICS: {
    BASIC: "/statistics",
    DETAILED: "/statistics/detailed",
  },

  // ========== AI ==========
  AI: {
    GET_MANGA: "/ai/get-manga",
    GENERATE_MANGA: "/ai/generate-manga",
  },

  // ========== Search Log ==========
  SEARCH_LOG: {
    CLICK: "/search-logs/click",
  },
} as const;
