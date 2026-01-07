import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "./Statcard";
import { TrendingUp, Users, BookOpen, Clock } from "lucide-react";
import { statisticsService } from "@/services/statistics.service";
import { PageLoader } from "@/components/common/PageLoader";
import type { DetailedStatistics } from "@/types/comment";
import { toast } from "sonner";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<DetailedStatistics | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await statisticsService.getDetailedStatistics();
      setStatistics(statsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !statistics) {
    return <PageLoader />;
  }

  // Prepare genre chart data - top 5 genres from API
  const genreChartData = (statistics.mangas.topGenres || [])
    .slice(0, 5)
    .map((genre, index) => ({
      name: genre.name,
      value: genre.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

  // Prepare manga status data for bar chart
  const mangaStatusData = [
    { status: "Đang tiến hành", count: statistics.mangas.ongoing },
    { status: "Hoàn thành", count: statistics.mangas.completed },
    { status: "Tạm dừng", count: statistics.mangas.hiatus },
  ];

  // Use totalViewCount from API
  const totalReads = statistics.mangas.totalViewCount || 0;

  // Format number for display
  const formatNumber = (num: number = 0): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Bảng điều khiển
        </h2>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan nền tảng của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="text-primary" size={24} />}
          label="Tổng số Manga"
          value={statistics.mangas.total.toString()}
          trend="+0%"
          trendUp
        />
        <StatCard
          icon={<Users className="text-primary" size={24} />}
          label="Tổng người dùng"
          value={statistics.users.total.toString()}
          trend="+0%"
          trendUp
        />
        <StatCard
          icon={<TrendingUp className="text-primary" size={24} />}
          label="Tổng lượt đọc"
          value={formatNumber(totalReads)}
          trend="+0%"
          trendUp
        />
        <StatCard
          icon={<Clock className="text-primary" size={24} />}
          label="Báo cáo chờ xử lý"
          value={statistics.reports.pending.toString()}
          trend="+0%"
          trendUp
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Statistics Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Thống kê người dùng theo vai trò
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { role: "Tổng", count: statistics.users.total },
                { role: "Uploader", count: statistics.users.uploaders },
                { role: "Độc giả", count: statistics.users.readers },
                { role: "Admin", count: statistics.users.admins },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="role" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                wrapperStyle={{ zIndex: 9999 }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 w-full">
            Top 5 thể loại
          </h3>
          {/* Ensure labels outside the pie are visible by allowing overflow */}
          <div className="w-full h-[250px] overflow-visible">
            <ResponsiveContainer
              width="100%"
              height="100%"
              className="overflow-visible"
            >
              <PieChart style={{ overflow: "visible" }}>
                <Pie
                  data={genreChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genreChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                  wrapperStyle={{ zIndex: 9999 }}
                  itemStyle={{
                    color: "var(--foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend describing colors for Pie chart (Top genres) */}
          <div className="w-full mt-4 flex flex-wrap gap-3">
            {genreChartData.map((g) => (
              <div key={g.name} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block w-3 h-3 rounded"
                  style={{ backgroundColor: g.color }}
                />
                <span className="text-muted-foreground">{g.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({g.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manga Status Bar Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Trạng thái truyện
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mangaStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="status" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
              wrapperStyle={{ zIndex: 9999 }}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports Status */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Tình trạng báo cáo
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              {statistics.reports.total}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Tổng báo cáo</p>
          </div>
          <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {statistics.reports.pending}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Đang chờ</p>
          </div>
          <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statistics.reports.resolved}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Đã giải quyết</p>
          </div>
        </div>
      </div>
    </div>
  );
}
