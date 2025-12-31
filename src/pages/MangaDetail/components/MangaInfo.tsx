import { useState } from "react";
import {
  BookOpen,
  Heart,
  Share2,
  Star,
  Eye,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Genre } from "@/types/genre";

interface MangaInfoProps {
  // Cover & Basic Info
  coverImage: string;
  title: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  author: string;
  artist?: string;
  createdAt: string;

  // Description & Genres
  description?: string;
  genres?: Genre[];

  // Stats
  averageRating?: number;
  viewCount?: number;
  followedCount?: number;
  chaptersCount: number;

  // Actions
  isFollowing: boolean;
  onStartReading: () => void;
  onFollowToggle: () => void;
  onShare: () => void;
  onReport?: () => void;
}

const statusColors = {
  ongoing: "bg-green-500",
  completed: "bg-blue-500",
  hiatus: "bg-yellow-500",
  cancelled: "bg-red-500",
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

import { BackButton } from "@/components/common/BackButton";

export const MangaInfo = ({
  coverImage,
  title,
  status,
  author,
  artist,
  createdAt,
  description,
  genres,
  averageRating,
  viewCount,
  followedCount,
  chaptersCount,
  isFollowing,
  onStartReading,
  onFollowToggle,
  onShare,
  onReport,
}: MangaInfoProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        
      <BackButton />
        {/* Cover Image */}
        <Card className="overflow-hidden">
          <img
            src={sanitizeImageUrl(coverImage)}
            alt={title}
            className="w-full h-auto object-cover"
            onError={handleImageError}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Card>

        {/* Action Buttons: primary start button + outline icon buttons */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            size="lg"
            onClick={onStartReading}
            disabled={chaptersCount === 0}
            className="flex-1"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {chaptersCount > 0 ? "Bắt đầu đọc" : "Chưa có chapter"}
          </Button>

          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={onFollowToggle}
            className="h-10 w-10 p-0 flex items-center justify-center"
            aria-label={isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="h-10 w-10 p-0 flex items-center justify-center"
            aria-label="Chia sẻ"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          {onReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReport}
              className="h-10 w-10 p-0 flex items-center justify-center text-destructive"
              aria-label="Báo cáo"
            >
              <Flag className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6 relative">
        
        {/* Header - Title and Status */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold flex-1">{title}</h1>
            <Badge className={statusColors[status]}>
              {getStatusInVietnamese(status)}
            </Badge>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{author}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Tác giả</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {artist && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{artist}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Họa sĩ</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Inline stats (icon + number) like metadata above */}
          <div className="mt-3 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">
                {viewCount?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-foreground">
                {followedCount?.toLocaleString() || 0}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-foreground">
                {averageRating?.toFixed(1) || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-foreground">
                {chaptersCount}
              </span>
            </div>
          </div>
        </div>

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Thể loại</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre._id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Mô tả</h3>
            <Card>
              <CardContent className="pt-6">
                <p
                  className={`text-sm leading-relaxed ${
                    !showFullDescription && "line-clamp-4"
                  }`}
                >
                  {description}
                </p>
                {description && description.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 p-0 h-auto font-semibold"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? (
                      <>
                        Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Xem thêm <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Duplicate stats removed — kept the primary stats block above. */}
      </div>
    </div>
  );
};
