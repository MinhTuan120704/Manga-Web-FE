import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Home/Homepage";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { MangaReader } from "@/pages/MangaReader/MangaReader";
import { Login, Register } from "@/pages/Auth";
import { NotFound } from "@/pages/NotFound/NotFound";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { uploaderRoutes } from "./uploaderRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout disableScroll={true}>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: "/manga/:id",
    element: <MangaDetail />,
  },
  {
    path: "/reader/:chapterId",
    element: <MangaReader />,
  },
  
  // ========== UPLOADER ROUTES ==========
  ...uploaderRoutes,
  
  {
    path: "*",
    element: <NotFound />,
  },
]);
