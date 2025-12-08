import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import { Dashboard } from "@/pages/Uploader/Dashboard/Dashboard";
import { CreateManga } from "@/pages/Uploader/CreateManga/CreateManga";
import { MangaManagement } from "@/pages/Uploader/MangaManagement/MangaManagement";
import { ChapterManagement } from "@/pages/Uploader/ChapterManagement/ChapterManagement";
import { CreateChapter } from "@/pages/Uploader/CreateChapter/CreateChapter";
import { EditChapter } from "@/pages/Uploader/EditChapter/EditChapter";
import { CommentManagement } from "@/pages/Uploader/CommentManagement/CommentManagement";
import { UploaderSettings } from "@/pages/Uploader/UploaderSettings/UploaderSettings";
import { Analytics } from "@/pages/Uploader/Analytics/Analytics";

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