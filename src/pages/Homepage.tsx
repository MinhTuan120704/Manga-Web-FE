import { MainLayout } from "@/components/layout/MainLayout";
import { FeaturedCarousel } from "@/components/homepage/FeaturedCarousel";
import { RecentUpdates } from "@/components/homepage/RecentUpdates";
import { PopularMangaGrid } from "@/components/homepage/PopularMangaGrid";
import { MangaCard } from "@/components/common/MangaCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  mockFeaturedManga,
  mockRecentUpdates,
  mockPopularManga,
  mockNewReleases,
} from "@/data/mockData";

export function Homepage() {
  const breadcrumbs = [{ label: "Home" }];

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Featured Carousel */}
        <FeaturedCarousel featuredManga={mockFeaturedManga} />

        {/* Recent Updates */}
        <RecentUpdates updates={mockRecentUpdates} />

        {/* Popular Manga */}
        <PopularMangaGrid popularManga={mockPopularManga} />

        {/* New Releases */}
        <div>
          <SectionHeader
            title="New Releases"
            subtitle="Fresh manga just added"
            showViewAll
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
            {mockNewReleases.map((manga) => (
              <MangaCard key={manga.id} manga={manga} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}