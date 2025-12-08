import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const ReportsComponent = lazy(() => import("./components/Reports"));
const LoadingSpinner = lazy(() => import("@/components/common/LoadingSpinner"));

export const AdminReports = () => {
  const breadcrumbs = [
    { label: "Quản trị", href: "/admin" },
    { label: "Báo cáo" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Suspense fallback={<LoadingSpinner />}>
        <ReportsComponent />
      </Suspense>
    </AdminLayout>
  );
};
