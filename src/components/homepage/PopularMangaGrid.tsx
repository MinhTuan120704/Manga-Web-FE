import { MangaCard } from "@/components/common/MangaCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import type { Manga } from "@/types";

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
  return (
    <div className="mb-8">
      <SectionHeader
        title="Popular Manga"
        subtitle="Most viewed manga this week"
        showViewAll
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                <MangaCard manga={manga} size="sm" onPreview={onPreview} />
              </div>
            ))}
      </div>
    </div>
  );
}
