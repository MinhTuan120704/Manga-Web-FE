import { lazy, Suspense, useState } from "react";

const AdminSidebar = lazy(() => import("@/components/admin/AdminSidebar"));
const DashboardOverview = lazy(
  () => import("@/components/admin/DashboardOverview")
);
const MangaManagement = lazy(
  () => import("@/components/admin/MangaManagement")
);
const Reports = lazy(() => import("@/components/admin/Reports"));
const TranslationQueue = lazy(
  () => import("@/components/admin/TranslationQueue")
);
const UserManagement = lazy(() => import("@/components/admin/UserManagement"));
const LoadingSpinner = lazy(() => import("@/components/common/LoadingSpinner"));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardOverview />
          </Suspense>
        );
      case "manga":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <MangaManagement />
          </Suspense>
        );
      case "users":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </Suspense>
        );
      case "translations":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TranslationQueue />
          </Suspense>
        );
      case "reports":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Reports />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardOverview />
          </Suspense>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
