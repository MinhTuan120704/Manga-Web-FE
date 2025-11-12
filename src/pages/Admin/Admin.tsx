import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import MangaManagement from "@/components/admin/MangaManagement";
import Reports from "@/components/admin/Reports";
import TranslationQueue from "@/components/admin/TranslationQueue";
import UserManagement from "@/components/admin/UserManagement";
import { useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "manga":
        return <MangaManagement />;
      case "users":
        return <UserManagement />;
      case "translations":
        return <TranslationQueue />;
      case "reports":
        return <Reports />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
