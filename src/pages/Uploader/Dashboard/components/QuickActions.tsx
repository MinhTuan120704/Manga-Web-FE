import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FolderOpen, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Plus,
      label: "Tạo truyện mới",
      description: "Thêm một truyện mới vào kho",
      onClick: () => navigate("/uploader/manga/create"),
      variant: "default" as const,
    },
    {
      icon: Upload,
      label: "Upload chapter",
      description: "Đăng tải chapter mới",
      onClick: () => navigate("/uploader/mangas"),
      variant: "outline" as const,
    },
    {
      icon: FolderOpen,
      label: "Quản lý truyện",
      description: "Xem tất cả truyện của bạn",
      onClick: () => navigate("/uploader/mangas"),
      variant: "outline" as const,
    },
    {
      icon: BarChart3,
      label: "Thống kê",
      description: "Xem báo cáo chi tiết",
      onClick: () => navigate("/uploader/analytics"),
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-auto justify-start text-left p-4"
            onClick={action.onClick}
          >
            <action.icon className="h-5 w-5 mr-3 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{action.label}</div>
              <div className="text-xs text-muted-foreground">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}