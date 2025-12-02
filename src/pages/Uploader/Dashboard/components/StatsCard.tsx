import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend 
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 mt-1 ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}% so với tháng trước</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}