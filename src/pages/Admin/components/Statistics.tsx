import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  Activity,
  RefreshCw,
  CheckCircle,
  Clock,
  PauseCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/PageLoader";
import { statisticsService } from "@/services/statistics.service";
import type { BasicStatistics, DetailedStatistics } from "@/types/comment";
import { toast } from "sonner";

export default function Statistics() {
  const [basicStats, setBasicStats] = useState<BasicStatistics | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [basic, detailed] = await Promise.all([
        statisticsService.getBasicStatistics(),
        statisticsService.getDetailedStatistics(),
      ]);
      setBasicStats(basic);
      setDetailedStats(detailed);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      toast.error("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Thống kê tổng quan
          </h2>
          <p className="text-muted-foreground">
            Xem tổng quan về hoạt động và dữ liệu nền tảng
          </p>
        </div>
        <Button onClick={fetchStatistics} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Basic Statistics */}
      {basicStats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng người dùng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {basicStats.users.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {basicStats.users.uploaders} uploader,{" "}
                  {basicStats.users.readers} reader
                </p>
              </CardContent>
            </Card>

            {/* Total Mangas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng truyện
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {basicStats.mangas.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tổng số manga trên nền tảng
                </p>
              </CardContent>
            </Card>

            {/* Total Reports */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng báo cáo
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {basicStats.reports.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Báo cáo vi phạm từ người dùng
                </p>
              </CardContent>
            </Card>

            {/* Admin Count */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quản trị viên
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {basicStats.users.admins.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Admin quản lý hệ thống
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Detailed Statistics */}
      {detailedStats && (
        <>
          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê người dùng</CardTitle>
              <CardDescription>
                Phân bố người dùng theo vai trò và quyền hạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Tổng số
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.users.total.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Uploader
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.users.uploaders.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Reader
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.users.readers.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Admin</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.users.admins.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manga Details */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê manga</CardTitle>
              <CardDescription>
                Phân bố manga theo trạng thái xuất bản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Tổng số
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.mangas.total.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Đang tiến hành
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.mangas.ongoing.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      Hoàn thành
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.mangas.completed.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PauseCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      Tạm ngưng
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.mangas.hiatus.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê báo cáo</CardTitle>
              <CardDescription>
                Phân bố báo cáo vi phạm theo trạng thái xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Tổng số
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.reports.total.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      Đang chờ
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.reports.pending.toLocaleString()}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Đã xử lý
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {detailedStats.reports.resolved.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
