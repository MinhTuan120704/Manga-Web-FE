import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import { Dashboard, CreateManga, MangaManagement, ChapterManagement } from "@/pages/Uploader";

export const uploaderRoutes: RouteObject[] = [
  {
    path: "/uploader",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/manga/create",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <CreateManga />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/mangas",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <MangaManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/manga/edit/:id",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <CreateManga />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/manga/:id/chapters",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <ChapterManagement />
      </ProtectedRoute>
    ),
  },
  // Alias route for details
  {
    path: "/uploader/manga/:id",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <ChapterManagement />
      </ProtectedRoute>
    ),
  },
];