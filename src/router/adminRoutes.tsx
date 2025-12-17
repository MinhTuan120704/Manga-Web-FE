import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/components/layout";
import { ProtectedRoute } from "./protectedRoute";
import DashboardOverview from "@/pages/Admin/components/DashboardOverview";
import MangaManagementComponent from "@/pages/Admin/components/MangaManagement";
import UserManagementComponent from "@/pages/Admin/components/UserManagement";
import TranslationQueue from "@/pages/Admin/components/TranslationQueue";
import ReportsComponent from "@/pages/Admin/components/Reports";
import SettingsComponent from "@/pages/Admin/components/Settings";

// Admin routes configuration
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/overview",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Tổng quan" },
          ]}
        >
          <DashboardOverview />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/manga",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Quản lý Manga" },
          ]}
        >
          <MangaManagementComponent />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Quản lý người dùng" },
          ]}
        >
          <UserManagementComponent />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/translations",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Dịch thuật" },
          ]}
        >
          <TranslationQueue />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Báo cáo" },
          ]}
        >
          <ReportsComponent />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout
          breadcrumbs={[
            { label: "Quản trị", href: "/admin" },
            { label: "Cài đặt" },
          ]}
        >
          <SettingsComponent />
        </AdminLayout>
      </ProtectedRoute>
    ),
  },
];
