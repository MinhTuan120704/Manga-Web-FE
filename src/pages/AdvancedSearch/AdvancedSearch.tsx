import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { genreService } from "@/services/genre.service";
import { mangaService } from "@/services/manga.service";
import type { Manga, MangaSearchParams } from "@/types/manga";
import type { Genre } from "@/types/genre";
import { SearchFilters } from "./components/SearchFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/common/ScrollToTop";

// Lazy load heavy components
const SearchResults = lazy(() =>
  import("./components/SearchResults").then((module) => ({
    default: module.SearchResults,
  }))
);

export const AdvancedSearch = () => {
  const [searchParams] = useSearchParams();
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm kiếm nâng cao" },
  ];

  // Genres data
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  // Search query from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Search filters
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Search results
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        const response = await genreService.getGenres();
        setGenres(response);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Update search query when URL params change
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Fetch mangas based on filters
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);
        const params: MangaSearchParams = {
          page: currentPage,
          limit: 12,
          sortBy: sortBy as MangaSearchParams["sortBy"],
        };

        // Add search query if exists
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        // Add genre filter if selected
        if (selectedGenres.length > 0) {
          params.genres = selectedGenres.join(",");
        }

        // Add status filter if not "all"
        if (selectedStatus !== "all") {
          params.status = selectedStatus as
            | "ongoing"
            | "completed" /* | "hiatus" | "cancelled" */;
        }

        const response = await mangaService.searchMangas(params);
        if (response) {
          setMangas(response.mangas);
          setTotalPages(response.pagination.totalPages);
          setTotalResults(response.pagination.totalItems);
        }
      } catch (error) {
        console.error("Failed to fetch mangas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [currentPage, selectedGenres, selectedStatus, sortBy, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenres, selectedStatus, sortBy, searchQuery]);

  const handleGenresChange = (genreIds: string[]) => {
    setSelectedGenres(genreIds);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Tìm kiếm nâng cao
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {searchQuery
                ? `Kết quả tìm kiếm cho: "${searchQuery}"`
                : "Tìm truyện theo thể loại, trạng thái và nhiều tiêu chí khác"}
            </p>
          </div>

          {/* Search Filters */}
          <SearchFilters
            genres={genres}
            loadingGenres={loadingGenres}
            selectedGenres={selectedGenres}
            selectedStatus={selectedStatus}
            sortBy={sortBy}
            onGenresChange={handleGenresChange}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
          />

          {/* Search Results */}
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <SearchResults
              mangas={mangas}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={handlePageChange}
            />
          </Suspense>
        </div>
      </MainLayout>
      <ScrollToTop />
    </>
  );
};
