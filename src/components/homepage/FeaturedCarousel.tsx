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
import { Play, Plus, Star } from "lucide-react";
import type { FeaturedManga } from "@/types/manga";

interface FeaturedCarouselProps {
  featuredManga: FeaturedManga[];
}

export function FeaturedCarousel({ featuredManga }: FeaturedCarouselProps) {
  return (
    <Carousel className="w-full mb-8">
      <CarouselContent>
        {featuredManga.map((manga) => (
          <CarouselItem key={manga.id}>
            <Card className="relative overflow-hidden h-96 bg-gradient-to-r from-black/50 to-transparent">
              <img
                src={manga.coverUrl}
                alt={manga.title}
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
              <CardContent className="relative h-full flex items-end p-8">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="bg-primary">
                      Featured
                    </Badge>
                    <Badge variant="secondary">{manga.status}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white">{manga.rating}</span>
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold text-white mb-2">
                    {manga.title}
                  </h1>

                  <p className="text-gray-200 mb-4 line-clamp-3">
                    {manga.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {manga.genres.slice(0, 4).map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="text-white border-white/50"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                                    size="lg"
                                    variant="default"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Read Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Library
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
