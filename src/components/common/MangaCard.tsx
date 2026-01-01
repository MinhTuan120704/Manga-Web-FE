import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, BookOpen, Eye, Heart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga } from "@/types/manga";
import type { Genre } from "@/types/genre";
import { useEffect, useState } from "react";

interface MangaCardProps {
  manga: Manga;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  onPreview?: (manga: Manga) => void;
  isFollowed?: boolean;
  onToggleFollow?: (mangaId: string, follow: boolean) => Promise<void> | void;
}

export function MangaCard({
  manga,
  showStats = true,
  size = "md",
  onPreview,
  isFollowed,
  onToggleFollow,
}: MangaCardProps) {
  const navigate = useNavigate();

  // Helper function để lấy tên genre
  const getGenreNames = (genres: Genre[] | string[]): string[] => {
    return genres?.map((genre) =>
      typeof genre === "string" ? genre : genre.name
    );
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
  const genreNames = getGenreNames(manga.genres);

  // Remove fixed widths, let card fill the grid column
  const imageSizes = {
    sm: "h-64",
    md: "h-80",
    lg: "h-100",
  };

  const handleCardClick = () => {
    navigate(`/manga/${manga._id}`);
  };

  const [followed, setFollowed] = useState<boolean>(!!isFollowed);

  useEffect(() => {
    setFollowed(!!isFollowed);
  }, [isFollowed]);

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = !followed;
    setFollowed(newValue);
    if (onToggleFollow) {
      try {
        await onToggleFollow(manga._id, newValue);
        // show success toast
        toast.success(
          `${newValue ? "Đã theo dõi" : "Đã bỏ theo dõi"} ${manga.title}`
        );
      } catch {
        toast.error(
          "Không thể thay đổi trạng thái theo dõi. Vui lòng thử lại."
        );
        setFollowed(!newValue);
      }
    }
  };

  return (
    <Card
      className="w-full min-w-[200px] sm:min-w-[220px] md:min-w-[260px] h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={sanitizeImageUrl(manga.coverImage)}
          alt={manga.title}
          className={`w-full ${imageSizes[size]} object-contain`}
          onError={handleImageError}
          loading="lazy"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={manga.status === "ongoing" ? "default" : "secondary"}>
            {getStatusInVietnamese(manga.status)}
          </Badge>
        </div>
        {showStats && manga.averageRating !== undefined && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs">
              {manga.averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Preview button - shows on hover */}
        {onPreview && (
          <div className="absolute inset-0 bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(manga);
              }}
              className="bg-primary shadow-black-900 "
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </Button>
          </div>
        )}
      </div>

      <CardContent className="px-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
          {manga.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
          {manga.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-1 mt-auto">
          {genreNames?.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>

      {showStats && (
        <CardFooter className="px-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFollow}
              onMouseDown={(e) => e.stopPropagation()}
              className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
              aria-label={followed ? "Bỏ theo dõi" : "Theo dõi"}
              title={followed ? "Đã theo dõi" : "Theo dõi"}
            >
              <Heart className={`h-4 w-4 ${followed ? "text-red-500" : ""}`} />
            </button>

            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{manga.viewCount || 0} Lượt xem</span>
            </div>
          </div>
          {(manga.updatedAt && 
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            
            <span>{getTimeAgo(manga.updatedAt)}</span>
          </div>)}
        </CardFooter>
      )}
    </Card>
  );
}
