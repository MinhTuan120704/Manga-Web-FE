import { MainLayout } from "@/components/layout/MainLayout";
import { FeaturedCarousel } from "@/pages/Home/components/FeaturedCarousel";
import { RecentUpdates } from "@/pages/Home/components/RecentUpdates";
import { PopularMangaGrid } from "@/pages/Home/components/PopularMangaGrid";
import { MangaCard } from "@/components/common/MangaCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PreviewPane } from "@/components/common/PreviewPane";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { mangaService } from "@/services/manga.service";
import type { Manga } from "@/types/manga";
import type { MangaListResponse } from "@/types/api";

export function Homepage() {
  const breadcrumbs = [{ label: "Trang chủ" }];
  const [showPreview, setShowPreview] = useState(false);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);

  // State cho các danh sách manga
  const [featuredMangas, setFeaturedMangas] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });
  const [popularMangas, setPopularMangas] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });
  const [recentMangas, setRecentMangas] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });
  const [newReleases, setNewReleases] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });

  // Loading states
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  // Fetch data khi component mount
  useEffect(() => {
    fetchFeaturedMangas();
    fetchPopularMangas();
    fetchRecentMangas();
    fetchNewReleases();
  }, []);

  const fetchFeaturedMangas = async () => {
    try {
      setLoadingFeatured(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 5,
        sortBy: "-averageRating",
      });
      if (response) {
        setFeaturedMangas(response);
      }
    } catch (error) {
      console.error("Error fetching featured mangas:", error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchPopularMangas = async () => {
    try {
      setLoadingPopular(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 12,
        sortBy: "-viewCount",
      });
      if (response) {
        setPopularMangas(response);
      }
    } catch (error) {
      console.error("Error fetching popular mangas:", error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const fetchRecentMangas = async () => {
    try {
      setLoadingRecent(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 9,
        sortBy: "-updatedAt",
      });
      if (response) {
        setRecentMangas(response);
      }
    } catch (error) {
      console.error("Error fetching recent mangas:", error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const fetchNewReleases = async () => {
    try {
      setLoadingNew(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 6,
        sortBy: "-createdAt",
      });
      if (response) {
        setNewReleases(response);
      }
    } catch (error) {
      console.error("Error fetching new releases:", error);
    } finally {
      setLoadingNew(false);
    }
  };

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
            featuredManga={featuredMangas.mangas}
            onPreview={handlePreview}
            loading={loadingFeatured}
          />

          {/* Recent Updates */}
          <RecentUpdates
            updates={recentMangas.mangas}
            onPreview={handlePreview}
            loading={loadingRecent}
          />

          {/* Popular Manga */}
          <PopularMangaGrid
            popularManga={popularMangas.mangas}
            onPreview={handlePreview}
            loading={loadingPopular}
          />

          {/* New Releases */}
          <div>
            <SectionHeader
              title="Mới phát hành"
              subtitle="Truyện mới vừa được thêm"
              showViewAll
              viewAllPath="/view-all"
              viewAllParams={{ sortBy: "newest" }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
              {loadingNew
                ? // Loading skeleton
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-40 w-full rounded" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                : newReleases.mangas.map((manga) => (
                    <MangaCard
                      key={manga._id}
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
      <ScrollToTop />
    </>
  );
}
