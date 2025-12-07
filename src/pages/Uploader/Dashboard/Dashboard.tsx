import { useState, useEffect } from "react";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { dashboardService } from "@/services/dashboard.service";
import { BookOpen, Eye, Users, TrendingUp, Loader2 } from "lucide-react";
import { StatsCard, RecentUploads, PopularMangas } from "./components";
import type { DashboardData } from "@/types/dashboard";

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getDashboardData();
      console.log("Dashboard data loaded:", data);
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UploaderLayout breadcrumbs={[{ label: "Dashboard" }]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </UploaderLayout>
    );
  }

  if (!dashboardData) {
    return (
      <UploaderLayout breadcrumbs={[{ label: "Dashboard" }]}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-destructive">Không thể tải dữ liệu dashboard</p>
            <button
              onClick={fetchDashboardData}
              className="text-primary hover:underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      </UploaderLayout>
    );
  }

  const { stats, recentlyUpdated, popularMangas } = dashboardData;

  return (
    <UploaderLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động và thống kê của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng truyện"
            value={stats.totalMangas}
            description="Truyện đang quản lý"
            icon={BookOpen}
          />
          <StatsCard
            title="Tổng chapters"
            value={stats.totalChapters}
            description="Chapters đã đăng tải"
            icon={TrendingUp}
          />
          <StatsCard
            title="Lượt xem"
            value={stats.totalViews.toLocaleString()}
            description="Tổng lượt xem"
            icon={Eye}
          />
          <StatsCard
            title="Người theo dõi"
            value={stats.totalFollowers.toLocaleString()}
            description="Tổng người theo dõi"
            icon={Users}
          />
        </div>

        {/* Recent Uploads - Full width */}
        <RecentUploads mangas={recentlyUpdated} onDelete={fetchDashboardData} />

        {/* Popular Mangas */}
        <PopularMangas mangas={popularMangas} />
      </div>
    </UploaderLayout>
  );
}
