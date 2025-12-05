import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { uploaderRoutes } from "./uploaderRoutes";
import LoadingSpinner from "@/components/common/LoadingSpinner";

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

const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

const AdminPage = lazy(() => import("@/pages/Admin/Admin"));

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
      <Suspense fallback={<LoadingSpinner />}>
        <Homepage />
      </Suspense>
    ),
  },

  {
    path: "/search",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdvancedSearch />
      </Suspense>
    ),
  },
  {
    path: "/ai-recommendation",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AIRecommendation />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayout disableScroll={true}>
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        </AuthLayout>
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayout>
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        </AuthLayout>
      </Suspense>
    ),
  },
  {
    path: "/user",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <UserLayout />
      </Suspense>
    ),
    children: [
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserSettings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/manga/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MangaDetail />
      </Suspense>
    ),
  },

  // ========== UPLOADER ROUTES ==========
  ...uploaderRoutes,

  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminPage />
      </Suspense>
    ),
  },
]);
