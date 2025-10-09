import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, BookOpen, Eye } from "lucide-react";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga, Genre } from "@/types";

interface MangaCardProps {
  manga: Manga;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  onPreview?: (manga: Manga) => void;
}

export function MangaCard({
  manga,
  showStats = true,
  size = "md",
  onPreview,
}: MangaCardProps) {
  // Helper function để lấy tên genre
  const getGenreNames = (genres: Genre[] | string[]): string[] => {
    return genres.map((genre) =>
      typeof genre === "string" ? genre : genre.name
    );
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

  const genreNames = getGenreNames(manga.genres);

  // Remove fixed widths, let card fill the grid column
  const imageSizes = {
    sm: "h-64",
    md: "h-80",
    lg: "h-100",
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col">
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
            {manga.status}
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
              Preview
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
          {genreNames.slice(0, 2).map((genre, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>

      {showStats && (
        <CardFooter className="px-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{manga.viewCount || 0} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{getTimeAgo(manga.updatedAt)}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
