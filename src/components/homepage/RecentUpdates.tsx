import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ChevronRight, Eye } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga, Genre } from "@/types";

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

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  if (loading) {
    return (
      <div className="mb-8">
        <SectionHeader
          title="Recent Updates"
          subtitle="Latest manga chapter releases"
          showViewAll
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
        title="Recent Updates"
        subtitle="Latest manga chapter releases"
        showViewAll
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((manga) => (
          <Card
            key={manga._id}
            className="hover:shadow-md transition-shadow cursor-pointer"
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
                    <span className="text-xs text-muted-foreground">
                      {manga.status}
                    </span>
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
