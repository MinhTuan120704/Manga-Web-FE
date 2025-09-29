import { MangaCard } from "@/components/common/MangaCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { PopularManga } from "@/types/manga";

interface PopularMangaGridProps {
  popularManga: PopularManga[];
}

export function PopularMangaGrid({ popularManga }: PopularMangaGridProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Popular Manga"
        subtitle="Most viewed manga this week"
        showViewAll
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {popularManga.map((item) => (
          <div key={item.manga.id} className="relative w-full">
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {item.rank}
              </div>
            </div>
            <MangaCard manga={item.manga} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
