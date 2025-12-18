import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ChevronRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "@/components/common/SectionHeader";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga } from "@/types/manga";
import type { Genre } from "@/types/genre";

interface RecentUpdatesProps {
  updates: Manga[];
  onPreview?: (manga: Manga) => void;
  loading?: boolean;
}

export function RecentUpdates({
  updates,
  onPreview,
  loading = false,
}: RecentUpdatesProps) {
  const navigate = useNavigate();

  // Helper function để lấy tên genre
  const getGenreName = (genres: Genre[] | string[]): string => {
    if (!genres || genres.length === 0) return "Unknown";
    const firstGenre = genres[0];
    return typeof firstGenre === "string" ? firstGenre : firstGenre.name;
  };

  // Helper function để format thời gian
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  };

  // Helper function để chuyển đổi status sang tiếng Việt
  const getStatusInVietnamese = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      ongoing: "Đang tiến hành",
      completed: "Hoàn thành",
      hiatus: "Tạm ngưng",
      cancelled: "Đã hủy",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <SectionHeader
          title="Cập nhật gần đây"
          subtitle="Chapter truyện mới nhất"
          showViewAll
          viewAllPath="/view-all"
          viewAllParams={{ sortBy: "-updatedAt" }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Skeleton className="w-16 h-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <SectionHeader
        title="Cập nhật gần đây"
        subtitle="Chapter truyện mới nhất"
        showViewAll
        viewAllPath="/view-all"
        viewAllParams={{ sortBy: "updated" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((manga) => (
          <Card
            key={manga._id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/manga/${manga._id}`)}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={sanitizeImageUrl(manga.coverImage)}
                  alt={manga.title}
                  className="w-16 h-20 object-cover rounded bg-muted"
                  onError={handleImageError}
                  loading="lazy"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {manga.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getGenreName(manga.genres)}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(manga.updatedAt)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={manga.status === "ongoing" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {getStatusInVietnamese(manga.status)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {onPreview && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview(manga);
                          }}
                          className="h-6 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
