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
import type { Genre } from "@/types";

interface MangaInfoProps {
  // Cover & Basic Info
  coverImage: string;
  title: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  author: string;
  artist?: string;
  createdAt: string;

  // Description & Genres
  description: string;
  genres: Genre[];

  // Stats
  averageRating?: number;
  viewCount?: number;
  followerCount?: number;
  chaptersCount: number;

  // Actions
  isFollowing: boolean;
  onStartReading: () => void;
  onFollowToggle: () => void;
  onShare: () => void;
}

const statusColors = {
  ongoing: "bg-green-500",
  completed: "bg-blue-500",
  hiatus: "bg-yellow-500",
  cancelled: "bg-red-500",
};

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
  followerCount,
  chaptersCount,
  isFollowing,
  onStartReading,
  onFollowToggle,
  onShare,
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

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={onStartReading}
            disabled={chaptersCount === 0}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {chaptersCount > 0 ? "Bắt đầu đọc" : "Chưa có chapter"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isFollowing ? "default" : "outline"}
              onClick={onFollowToggle}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isFollowing ? "fill-current" : ""}`}
              />
              {isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </Button>
            <Button variant="outline" onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header - Title and Status */}
        <div>
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold flex-1">{title}</h1>
            <Badge className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
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

            {averageRating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Genres */}
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

        {/* Description */}
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
              {description.length > 200 && (
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

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">
                {viewCount?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground">Lượt xem</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">
                {followerCount?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Người theo dõi
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400 fill-current" />
              <div className="text-2xl font-bold">
                {averageRating?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">Đánh giá</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{chaptersCount}</div>
              <div className="text-xs text-muted-foreground">Chapter</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
