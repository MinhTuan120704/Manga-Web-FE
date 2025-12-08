import type React from "react";
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend}
        </span>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}
