import { useState } from "react";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  BookOpen,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - replace with real API calls
const viewsData = [
  { date: "01/12", views: 1200, reads: 890 },
  { date: "02/12", views: 1500, reads: 1100 },
  { date: "03/12", views: 1800, reads: 1350 },
  { date: "04/12", views: 2200, reads: 1650 },
  { date: "05/12", views: 1900, reads: 1420 },
  { date: "06/12", views: 2400, reads: 1800 },
  { date: "07/12", views: 2800, reads: 2100 },
];

const topMangaData = [
  { name: "Manga A", views: 45000, chapters: 120 },
  { name: "Manga B", views: 38000, chapters: 95 },
  { name: "Manga C", views: 32000, chapters: 78 },
  { name: "Manga D", views: 28000, chapters: 156 },
  { name: "Manga E", views: 22000, chapters: 45 },
];

const genreDistribution = [
  { name: "Action", value: 35 },
  { name: "Romance", value: 25 },
  { name: "Fantasy", value: 20 },
  { name: "Drama", value: 12 },
  { name: "Comedy", value: 8 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
}

const StatCard = ({ title, value, change, icon: Icon, description }: StatCardProps) => {
  const isPositive = change && change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(change)}% so với tuần trước</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
 


  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader/dashboard" },
        { label: "Thống kê" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Thống kê</h1>
            <p className="text-muted-foreground">
              Phân tích chi tiết về hoạt động và hiệu suất của bạn
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">90 ngày qua</SelectItem>
              <SelectItem value="1year">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng lượt xem"
            value="124,589"
            change={12.5}
            icon={Eye}
            description="Tất cả các truyện"
          />
          <StatCard
            title="Lượt đọc"
            value="89,234"
            change={8.2}
            icon={BookOpen}
            description="Người đọc thực tế"
          />
          <StatCard
            title="Bình luận"
            value="3,421"
            change={-2.4}
            icon={MessageSquare}
            description="Tương tác từ độc giả"
          />
          <StatCard
            title="Người theo dõi"
            value="5,678"
            change={15.3}
            icon={Users}
            description="Người theo dõi mới"
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="views" className="space-y-4">
          <TabsList>
            <TabsTrigger value="views">Lượt xem</TabsTrigger>
            <TabsTrigger value="top-manga">Top truyện</TabsTrigger>
            <TabsTrigger value="genres">Thể loại</TabsTrigger>
          </TabsList>

          <TabsContent value="views" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lượt xem & Lượt đọc theo thời gian</CardTitle>
                <CardDescription>
                  Thống kê lượt xem và lượt đọc thực tế trong {timeRange === "7days" ? "7 ngày" : timeRange === "30days" ? "30 ngày" : timeRange === "90days" ? "90 ngày" : "1 năm"} qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Lượt xem"
                    />
                    <Line
                      type="monotone"
                      dataKey="reads"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Lượt đọc"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-manga" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 truyện phổ biến</CardTitle>
                <CardDescription>
                  Xếp hạng theo lượt xem trong {timeRange === "7days" ? "7 ngày" : timeRange === "30days" ? "30 ngày" : timeRange === "90days" ? "90 ngày" : "1 năm"} qua
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topMangaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" name="Lượt xem" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Table view */}
                <div className="mt-6 space-y-2">
                  {topMangaData.map((manga, index) => (
                    <div
                      key={manga.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{manga.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {manga.chapters} chương
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{manga.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">lượt xem</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genres" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố thể loại</CardTitle>
                <CardDescription>
                  Tỷ lệ phần trăm các thể loại truyện bạn đã đăng tải
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genreDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-col justify-center space-y-3">
                    {genreDistribution.map((genre, index) => (
                      <div key={genre.name} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{genre.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {genre.value}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${genre.value}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các sự kiện quan trọng trong 7 ngày qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "07/12/2025", event: "Manga A đạt 1000 lượt xem", type: "success" },
                { date: "06/12/2025", event: "30 bình luận mới trên Manga B", type: "info" },
                { date: "05/12/2025", event: "50 người theo dõi mới", type: "success" },
                { date: "04/12/2025", event: "Chapter 120 - Manga A được đăng", type: "info" },
                { date: "03/12/2025", event: "Manga C lên trending", type: "success" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {activity.type === "success" ? "Thành tích" : "Cập nhật"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UploaderLayout>
  );
};
