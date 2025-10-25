import React from "react";
import { X, Star, Calendar, User, Tag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga, Genre } from "@/types";

interface PreviewPaneProps {
  show: boolean;
  manga: Manga | null;
  onClose: () => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  show,
  manga,
  onClose,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);
  const [currentManga, setCurrentManga] = React.useState<Manga | null>(null);
  const [fadeIn, setFadeIn] = React.useState(false);

  React.useEffect(() => {
    if (show && manga) {
      setCurrentManga(manga);
      setVisible(true);
      setTimeout(() => setFadeIn(true), 100);
    } else if (!show) {
      setFadeIn(false);
      const timer = setTimeout(() => {
        setVisible(false);
        setCurrentManga(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show, manga]);

  if (!currentManga || !visible) return null;

  // Helper function để lấy tên genre
  const getGenreNames = (genres: Genre[] | string[]): string[] => {
    return genres.map((genre) =>
      typeof genre === "string" ? genre : genre.name
    );
  };

  // Helper function để format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const genreNames = getGenreNames(currentManga.genres);

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black z-[48]"
        style={{
          transition: "opacity 0.3s ease-in-out",
          opacity: fadeIn ? 0.3 : 0,
          pointerEvents: fadeIn ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Preview modal: fade in/out */}
      <div
        className="fixed top-0 right-0 w-full md:w-1/2 lg:w-2/5 h-full bg-background border-l shadow-2xl z-50"
        style={{
          transition: "opacity 0.3s ease-in-out",
          opacity: fadeIn ? 1 : 0,
          pointerEvents: fadeIn ? "auto" : "none",
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-bold">Preview Truyện</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {/* Cover and basic info */}
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={sanitizeImageUrl(currentManga.coverImage)}
                  alt={currentManga.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md bg-muted"
                  onError={handleImageError}
                  loading="lazy"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                  {currentManga.title}
                </h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{currentManga.author}</span>
                  </div>
                  {currentManga.artist && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Artist: {currentManga.artist}</span>
                    </div>
                  )}
                  {currentManga.averageRating !== undefined && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                      <span>{currentManga.averageRating.toFixed(1)}/10</span>
                    </div>
                  )}
                  {currentManga.viewCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>
                        {currentManga.viewCount.toLocaleString()} views
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {formatDate(currentManga.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <Badge
                variant={
                  currentManga.status === "ongoing"
                    ? "default"
                    : currentManga.status === "completed"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {currentManga.status === "ongoing"
                  ? "Đang tiến hành"
                  : currentManga.status === "completed"
                  ? "Hoàn thành"
                  : currentManga.status === "hiatus"
                  ? "Tạm ngưng"
                  : "Đã hủy"}
              </Badge>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Thể loại
              </h4>
              <div className="flex flex-wrap gap-2">
                {genreNames.map((genre, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2">Mô tả</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentManga.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  navigate(`/manga/${currentManga._id}`);
                  onClose();
                }}
              >
                Đọc ngay
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Thêm vào thư viện
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
