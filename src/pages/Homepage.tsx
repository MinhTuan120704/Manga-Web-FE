import { MainLayout } from "@/components/layout/MainLayout";
import { FeaturedCarousel } from "@/components/homepage/FeaturedCarousel";
import { RecentUpdates } from "@/components/homepage/RecentUpdates";
import { PopularMangaGrid } from "@/components/homepage/PopularMangaGrid";
import { MangaCard } from "@/components/common/MangaCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PreviewPane } from "@/components/common/PreviewPane";
import {
  mockFeaturedManga,
  mockRecentUpdates,
  mockPopularManga,
  mockNewReleases,
} from "@/data/mockData";
import { useState } from "react";
import type { Manga } from "@/types/manga";

export function Homepage() {
  const breadcrumbs = [{ label: "Home" }];
  const [showPreview, setShowPreview] = useState(false);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);

  const handlePreview = (manga: Manga) => {
    setSelectedManga(manga);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedManga(null);
  };

  return (
    <>
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-8">
          {/* Featured Carousel */}
          <FeaturedCarousel
            featuredManga={mockFeaturedManga}
            onPreview={handlePreview}
          />

          {/* Recent Updates */}
          <RecentUpdates
            updates={mockRecentUpdates}
            onPreview={handlePreview}
          />

          {/* Popular Manga */}
          <PopularMangaGrid
            popularManga={mockPopularManga}
            onPreview={handlePreview}
          />

          {/* New Releases */}
          <div>
            <SectionHeader
              title="New Releases"
              subtitle="Fresh manga just added"
              showViewAll
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {mockNewReleases.map((manga) => (
                <MangaCard
                  key={manga.id}
                  manga={manga}
                  size="sm"
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Preview Pane */}
      <PreviewPane
        show={showPreview}
        manga={selectedManga}
        onClose={handleClosePreview}
      />
    </>
  );
}
