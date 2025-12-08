import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import { Dashboard, CreateManga, MangaManagement, ChapterManagement, CreateChapter, EditChapter, CommentManagement, UploaderSettings, Analytics } from "@/pages/Uploader";

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
    path: "/uploader/comments",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <CommentManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/settings",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <UploaderSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/analytics",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <Analytics />
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
  {
    path: "/uploader/manga/:id/create-chapter",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <CreateChapter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/uploader/manga/:mangaId/chapter/:chapterId/edit",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <EditChapter />
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