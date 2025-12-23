import { createBrowserRouter } from "react-router-dom";

import { uploaderRoutes } from "./uploaderRoutes";
import { adminRoutes } from "./adminRoutes";
import { RoleBasedLayout } from "@/components/layout";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { Login, Register, ForgotPassword } from "@/pages/Auth";
import { AuthLayout } from "@/components/layout/AuthLayout";
import NotFound from "@/pages/NotFound/NotFound";
import { Homepage } from "@/pages/Home/Homepage";
import { UserProfile } from "@/pages/UserProfile/UserProfile";
import { MangaReader } from "@/pages/MangaReader/MangaReader";
import { AdvancedSearch } from "@/pages/AdvancedSearch/AdvancedSearch";
import { UserSettings } from "@/pages/UserProfile/components/UserSettings";
import { AIRecommendation } from "@/pages/AIRecommendation/AIRecommendation";
import { ViewAll } from "@/pages/ViewAll";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },

  {
    path: "/search",
    element: <AdvancedSearch />,
  },
  {
    path: "/view-all",
    element: <ViewAll />,
  },
  {
    path: "/ai-recommendation",
    element: <AIRecommendation />,
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
    path: "/forgot-password",
    element: (
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    ),
  },
  {
    path: "/user/profile",
    element: (
      <RoleBasedLayout
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Trang cá nhân" },
        ]}
      >
        <UserProfile />
      </RoleBasedLayout>
    ),
  },
  {
    path: "/user/settings",
    element: (
      <RoleBasedLayout
        breadcrumbs={[{ label: "Trang chủ", href: "/" }, { label: "Cài đặt" }]}
      >
        <UserSettings />
      </RoleBasedLayout>
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

  // ========== ADMIN ROUTES ==========
  ...adminRoutes,

  // ========== UPLOADER ROUTES ==========
  ...uploaderRoutes,

  {
    path: "*",
    element: <NotFound />,
  },
]);
