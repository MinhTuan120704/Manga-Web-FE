import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { AdminLayout } from "@/components/layout";
import { ProtectedRoute } from "./protectedRoute";

// Lazy load admin components
const DashboardOverview = lazy(
  () => import("@/pages/Admin/components/DashboardOverview")
);
const MangaManagementComponent = lazy(
  () => import("@/pages/Admin/components/MangaManagement")
);
const UserManagementComponent = lazy(
  () => import("@/pages/Admin/components/UserManagement")
);
const TranslationQueue = lazy(
  () => import("@/pages/Admin/components/TranslationQueue")
);
const ReportsComponent = lazy(() => import("@/pages/Admin/components/Reports"));
const SettingsComponent = lazy(
  () => import("@/pages/Admin/components/Settings")
);

// Admin routes configuration
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/overview",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Tổng quan" },
            ]}
          >
            <DashboardOverview />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/manga",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Quản lý Manga" },
            ]}
          >
            <MangaManagementComponent />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Quản lý người dùng" },
            ]}
          >
            <UserManagementComponent />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/translations",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Dịch thuật" },
            ]}
          >
            <TranslationQueue />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Báo cáo" },
            ]}
          >
            <ReportsComponent />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={<PageLoader />}>
          <AdminLayout
            breadcrumbs={[
              { label: "Quản trị", href: "/admin" },
              { label: "Cài đặt" },
            ]}
          >
            <SettingsComponent />
          </AdminLayout>
        </Suspense>
      </ProtectedRoute>
    ),
  },
];
