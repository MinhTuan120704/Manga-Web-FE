import { MangaCard } from "@/components/common/MangaCard";
import { userService } from "@/services/user.service";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import type { Manga } from "@/types/manga";

interface PopularMangaGridProps {
  popularManga: Manga[];
  onPreview?: (manga: Manga) => void;
  loading?: boolean;
}

export function PopularMangaGrid({
  popularManga,
  onPreview,
  loading = false,
}: PopularMangaGridProps) {
  const handleToggleFollow = async (mangaId: string, follow: boolean) => {
    try {
      if (follow) await userService.followManga({ mangaId });
      else await userService.unfollowManga(mangaId);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      throw err;
    }
  };
  return (
    <div className="mb-8">
      <SectionHeader
        title="Truyện phổ biến"
        subtitle="Truyện được xem nhiều nhất tuần này"
        showViewAll
        viewAllPath="/view-all"
        viewAllParams={{ sortBy: "mostViewed" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
        {loading
          ? // Loading skeleton
            Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-40 w-full rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : popularManga.map((manga, index) => (
              <div key={manga._id} className="relative w-full">
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex h-full">
                  <MangaCard
                    manga={manga}
                    size="sm"
                    onPreview={onPreview}
                    onToggleFollow={handleToggleFollow}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
