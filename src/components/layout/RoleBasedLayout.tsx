import { lazy, Suspense } from "react";
import { authService } from "@/services/auth.service";
import { PageLoader } from "@/components/common/PageLoader";

const MainLayout = lazy(() =>
  import("./MainLayout").then((module) => ({
    default: module.MainLayout,
  }))
);

const AdminLayout = lazy(() =>
  import("./AdminLayout").then((module) => ({
    default: module.AdminLayout,
  }))
);

const UploaderLayout = lazy(() =>
  import("./UploaderLayout").then((module) => ({
    default: module.UploaderLayout,
  }))
);

/* const UserLayout = lazy(() =>
  import("./UserLayout").then((module) => ({
    default: module.UserLayout,
  }))
); */

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

/**
 * Layout wrapper that renders the appropriate layout based on user role
 * - Admin → AdminLayout
 * - Uploader → UploaderLayout
 * - Reader (logged in) → MainLayout
 * - Guest (not logged in) → MainLayout
 */
export function RoleBasedLayout({
  children,
  breadcrumbs = [],
}: RoleBasedLayoutProps) {
  const user = authService.getStoredUser();

  // Determine which layout to use based on role
  let LayoutComponent = MainLayout;

  if (user) {
    if (user.role === "admin") {
      LayoutComponent = AdminLayout;
    } else if (user.role === "uploader") {
      LayoutComponent = UploaderLayout;
    }
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <LayoutComponent breadcrumbs={breadcrumbs}>{children}</LayoutComponent>
    </Suspense>
  );
}
