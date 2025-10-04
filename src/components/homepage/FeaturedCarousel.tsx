import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus, Star, Eye } from "lucide-react";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import type { Manga, Genre } from "@/types";

interface FeaturedCarouselProps {
  featuredManga: Manga[];
  onPreview?: (manga: Manga) => void;
  loading?: boolean;
}

export function FeaturedCarousel({
  featuredManga,
  onPreview,
  loading = false,
}: FeaturedCarouselProps) {
  // Helper function để lấy tên genre
  const getGenreNames = (genres: Genre[] | string[]): string[] => {
    return genres.map((genre) =>
      typeof genre === "string" ? genre : genre.name
    );
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden h-96 bg-muted">
        <CardContent className="relative h-full flex items-end p-8">
          <div className="max-w-2xl space-y-4 w-full">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!featuredManga || featuredManga.length === 0) {
    return null;
  }

  return (
    <Carousel className="w-full mb-8">
      <CarouselContent>
        {featuredManga.map((manga) => {
          const genreNames = getGenreNames(manga.genres);

          return (
            <CarouselItem key={manga._id}>
              <Card className="relative overflow-hidden h-96 bg-gradient-to-r from-black/50 to-transparent">
                <img
                  src={sanitizeImageUrl(manga.coverImage)}
                  alt={manga.title}
                  className="absolute inset-0 w-full h-full object-cover -z-10 bg-muted"
                  onError={handleImageError}
                  loading="lazy"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <CardContent className="relative h-full flex items-end p-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="default" className="bg-primary">
                        Featured
                      </Badge>
                      <Badge variant="secondary">{manga.status}</Badge>
                      {manga.averageRating !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">
                            {manga.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2">
                      {manga.title}
                    </h1>

                    <p className="text-gray-200 mb-4 line-clamp-3">
                      {manga.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {genreNames.slice(0, 4).map((genre, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-white border-white/50"
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button size="lg" variant="default">
                        <Play className="h-4 w-4 mr-2" />
                        Read Now
                      </Button>
                      <Button size="lg" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Library
                      </Button>
                      {onPreview && (
                        <Button
                          size="lg"
                          variant="secondary"
                          onClick={() => onPreview(manga)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
