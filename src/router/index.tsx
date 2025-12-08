import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { uploaderRoutes } from "./uploaderRoutes";
import { adminRoutes } from "./adminRoutes";
import { PageLoader } from "@/components/common/PageLoader";
// Lazy load all components
const MangaDetail = lazy(() =>
  import("@/pages/MangaDetail/MangaDetail").then((module) => ({
    default: module.MangaDetail,
  }))
);

const Login = lazy(() =>
  import("@/pages/Auth").then((module) => ({
    default: module.Login,
  }))
);

const Register = lazy(() =>
  import("@/pages/Auth").then((module) => ({
    default: module.Register,
  }))
);

const AuthLayout = lazy(() =>
  import("@/components/layout/AuthLayout").then((module) => ({
    default: module.AuthLayout,
  }))
);

const UserLayout = lazy(() =>
  import("@/components/layout").then((module) => ({
    default: module.UserLayout,
  }))
);

const NotFound = lazy(() =>
  import("@/pages/NotFound/NotFound").then((module) => ({
    default: module.default,
  }))
);

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
const MangaReader = lazy(() =>
  import("@/pages/MangaReader/MangaReader").then((module) => ({
    default: module.MangaReader,
  }))
);

const AdvancedSearch = lazy(() =>
  import("@/pages/AdvancedSearch/AdvancedSearch").then((module) => ({
    default: module.AdvancedSearch,
  }))
);

const UserSettings = lazy(() =>
  import("@/pages/UserProfile/components/UserSettings").then((module) => ({
    default: module.UserSettings,
  }))
);

const AIRecommendation = lazy(() =>
  import("@/pages/AIRecommendation/AIRecommendation").then((module) => ({
    default: module.AIRecommendation,
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
    path: "/ai-recommendation",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AIRecommendation />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthLayout disableScroll={true}>
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        </AuthLayout>
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthLayout>
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        </AuthLayout>
      </Suspense>
    ),
  },
  {
    path: "/user",
    element: (
      <Suspense fallback={<PageLoader />}>
        <UserLayout />
      </Suspense>
    ),
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
    element: (
      <Suspense fallback={<PageLoader />}>
        <MangaDetail />
      </Suspense>
    ),
  },
  {
    path: "/reader/:chapterId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <MangaReader />
      </Suspense>
    ),
  },

  // ========== ADMIN ROUTES ==========
  ...adminRoutes,

  // ========== UPLOADER ROUTES ==========
  ...uploaderRoutes,

  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
