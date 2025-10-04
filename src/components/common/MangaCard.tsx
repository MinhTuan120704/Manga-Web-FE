import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, BookOpen, Eye } from "lucide-react";
import type { Manga } from "@/types/manga";

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
  // Remove fixed widths, let card fill the grid column
  const imageSizes = {
    sm: "h-40",
    md: "h-64",
    lg: "h-80",
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={manga.coverUrl}
          alt={manga.title}
          className={`w-full ${imageSizes[size]} object-cover`}
        />
        <div className="absolute top-2 right-2">
          <Badge variant={manga.status === "ongoing" ? "default" : "secondary"}>
            {manga.status}
          </Badge>
        </div>
        {showStats && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 rounded px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs">{manga.rating}</span>
          </div>
        )}

        {/* Preview button - shows on hover */}
        {onPreview && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(manga);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
          {manga.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {manga.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {manga.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>

      {showStats && (
        <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{manga.chapters} ch</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{manga.updatedAt}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
