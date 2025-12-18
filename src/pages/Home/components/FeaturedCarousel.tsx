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
import { Play, Heart, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleImageError, sanitizeImageUrl } from "@/utils/imageHelper";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import type { Manga } from "@/types/manga";
import type { Genre } from "@/types/genre";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";

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
  const navigate = useNavigate();
  const AUTOPLAY_DELAY = 10000;

  const plugin = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
  );
  const [isPaused, setIsPaused] = useState(false);
  const [followedMangas, setFollowedMangas] = useState<string[]>([]);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    checkFollowedMangas();
  }, []);

  const checkFollowedMangas = async () => {
    if (!authService.isAuthenticated()) {
      setFollowedMangas([]);
      return;
    }

    try {
      const profile = await userService.getMyProfile();
      if (profile?.followedMangas) {
        setFollowedMangas(profile.followedMangas);
      }
    } catch (error) {
      console.error("Failed to check followed mangas:", error);
    }
  };

  const handleFollowToggle = async (mangaId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để theo dõi truyện");
      return;
    }

    try {
      setFollowLoading(mangaId);
      const isFollowing = followedMangas.includes(mangaId);

      if (isFollowing) {
        await userService.unfollowManga(mangaId);
        setFollowedMangas((prev) => prev.filter((id) => id !== mangaId));
        toast.success("Đã hủy theo dõi truyện");
      } else {
        await userService.followManga({ mangaId });
        setFollowedMangas((prev) => [...prev, mangaId]);
        toast.success("Đã thêm vào thư viện");
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setFollowLoading(null);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    plugin.current.stop();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    plugin.current.play();
  };

  // Helper function để lấy tên genre
  const getGenreNames = (genres: Genre[] | string[]): string[] => {
    return genres.map((genre) =>
      typeof genre === "string" ? genre : genre.name
    );
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
    <div className="w-full mb-8">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent>
          {featuredManga.map((manga) => {
            const genreNames = getGenreNames(manga.genres);

            return (
              <CarouselItem key={manga._id}>
                <Card className="relative overflow-hidden h-96 bg-muted rounded-xl">
                  <CardContent className="h-full flex p-0">
                    <div className="w-1/3 h-full relative">
                      <img
                        src={sanitizeImageUrl(manga.coverImage)}
                        alt={manga.title}
                        className="w-full h-full object-contain bg-muted rounded-l-xl"
                        onError={handleImageError}
                        loading="lazy"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="w-2/3 h-full flex items-center p-8  from-background/95 to-background ">
                      <div className="max-w-full">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="default" className="bg-primary">
                            Nổi bật
                          </Badge>
                          <Badge variant="secondary">{getStatusInVietnamese(manga.status)}</Badge>
                          {manga.averageRating !== undefined && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-foreground">
                                {manga.averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>

                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          {manga.title}
                        </h1>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {manga.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {genreNames.slice(0, 4).map((genre, index) => (
                            <Badge key={index} variant="outline">
                              {genre}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-4 flex-wrap">
                          <Button
                            size="lg"
                            variant="default"
                            onClick={() => navigate(`/manga/${manga._id}`)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Đọc ngay
                          </Button>
                          <Button
                            size="lg"
                            variant={
                              followedMangas.includes(manga._id)
                                ? "secondary"
                                : "outline"
                            }
                            onClick={(e) => handleFollowToggle(manga._id, e)}
                            disabled={followLoading === manga._id}
                          >
                            <Heart
                              className={`h-4 w-4 mr-2 ${
                                followedMangas.includes(manga._id)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                            {followedMangas.includes(manga._id)
                              ? "Đã theo dõi"
                              : "Thêm vào thư viện"}
                          </Button>
                          {onPreview && (
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreview(manga);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem trước
                            </Button>
                          )}
                        </div>
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
      <div className="mt-4 flex justify-center">
        <div className="relative h-1 w-64 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-none"
            style={{
              animation: isPaused
                ? "none"
                : `progress ${AUTOPLAY_DELAY}ms linear infinite`,
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
