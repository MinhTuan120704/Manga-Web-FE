import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const lineChartData = [
  { month: "Jan", reads: 4000, uploads: 2400 },
  { month: "Feb", reads: 3000, uploads: 1398 },
  { month: "Mar", reads: 2000, uploads: 9800 },
  { month: "Apr", reads: 2780, uploads: 3908 },
  { month: "May", reads: 1890, uploads: 4800 },
  { month: "Jun", reads: 2390, uploads: 3800 },
];

const genreData = [
  { name: "Action", value: 32, color: "var(--chart-1)" },
  { name: "Romance", value: 25, color: "var(--chart-2)" },
  { name: "Comedy", value: 18, color: "var(--chart-3)" },
  { name: "Drama", value: 15, color: "var(--chart-4)" },
  { name: "Other", value: 10, color: "var(--chart-5)" },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="text-primary" size={24} />}
          label="Total Manga"
          value="1,234"
          trend="+12%"
          trendUp
        />
        <StatCard
          icon={<Users className="text-primary" size={24} />}
          label="Active Users"
          value="8,456"
          trend="+5%"
          trendUp
        />
        <StatCard
          icon={<TrendingUp className="text-primary" size={24} />}
          label="Total Reads"
          value="245.2K"
          trend="+23%"
          trendUp
        />
        <StatCard
          icon={<Clock className="text-primary" size={24} />}
          label="Pending Reviews"
          value="42"
          trend="-8%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Activity Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              />
              <Line
                type="monotone"
                dataKey="reads"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 w-full">
            Popular Genres
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
                itemStyle={{
                  color: "var(--foreground",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Monthly Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
            />
            <Bar dataKey="reads" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            <Bar
              dataKey="uploads"
              fill="var(--chart-4)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
