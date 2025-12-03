import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { MangaReader } from "@/pages/MangaReader/MangaReader";
import { Login, Register } from "@/pages/Auth";
import { NotFound } from "@/pages/NotFound/NotFound";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { uploaderRoutes } from "./uploaderRoutes";
import { UserLayout } from "@/components/layout";
import { PageLoader } from "@/components/common/PageLoader";

// Lazy load components
const Homepage = lazy(() =>
  import("@/pages/Home/Homepage").then((module) => ({
    default: module.Homepage,
  }))
);
const UserProfile = lazy(() =>
  import("@/pages/UserProfile/UserProfile").then((module) => ({
    default: module.UserProfile,
  }))
);
const UserSettings = lazy(() =>
  import("@/pages/UserProfile/components/UserSettings").then((module) => ({
    default: module.UserSettings,
  }))
);
const AdvancedSearch = lazy(() =>
  import("@/pages/AdvancedSearch/AdvancedSearch").then((module) => ({
    default: module.AdvancedSearch,
  }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Homepage />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdvancedSearch />
      </Suspense>
    ),
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
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "profile",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserSettings />
          </Suspense>
        ),
      },
    ],
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
