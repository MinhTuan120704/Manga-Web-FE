import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Manga } from "@/types/manga";

interface RecentUploadsProps {
  mangas: Manga[];
}

export function RecentUploads({ mangas }: RecentUploadsProps) {
  const navigate = useNavigate();

  // Sort by updatedAt và lấy 5 truyện mới nhất
  const recentMangas = [...mangas]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      ongoing: "default",
      completed: "secondary",
      hiatus: "outline",
    };
    return variants[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ongoing: "Đang tiến hành",
      completed: "Hoàn thành",
      hiatus: "Tạm ngưng",
    };
    return labels[status] || status;
  };

  if (recentMangas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Truyện mới cập nhật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có truyện nào. Hãy tạo truyện mới!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Truyện mới cập nhật</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMangas.map((manga) => (
            <div
              key={manga._id}
              onClick={() => navigate(`/uploader/manga/${manga._id}/chapters`)}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer group"
            >
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="w-16 h-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-manga.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                  {manga.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusBadge(manga.status)}>
                    {getStatusLabel(manga.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {manga.chapterCount || 0} chapters
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(manga.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{(manga.viewCount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
