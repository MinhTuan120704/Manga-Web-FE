import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./protectedRoute";
import { Dashboard } from "@/pages/Uploader/Dashboard";

export const uploaderRoutes: RouteObject[] = [
  {
    path: "/uploader",
    element: (
      <ProtectedRoute requiredRole="uploader">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  // Sẽ thêm các routes khác sau
  // {
  //   path: "/uploader/mangas",
  //   element: (
  //     <ProtectedRoute requiredRole="uploader">
  //       <MyMangas />
  //     </ProtectedRoute>
  //   ),
  // },
];