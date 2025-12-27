import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MangaCard } from "@/components/common/MangaCard";
import { userService } from "@/services/user.service";
import { PreviewPane } from "@/components/common/PreviewPane";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { searchLogService } from "@/services/searchLog.service";
import type { Manga } from "@/types/manga";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface SearchResultsProps {
  mangas: Manga[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  searchQuery?: string;
  onPageChange: (page: number) => void;
}

export const SearchResults = ({
  mangas,
  loading,
  currentPage,
  totalPages,
  totalResults,
  searchQuery,
  onPageChange,
}: SearchResultsProps) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);

  // Handle manga click - log for ML training and navigate
  const handleMangaClick = (manga: Manga, index: number) => {
    // Log click for search ranking ML model (only if from search)
    if (searchQuery && searchQuery.trim()) {
      searchLogService.logClick({
        query: searchQuery.trim(),
        mangaId: manga._id,
        position: index + 1, // 1-indexed position
      });
    }
    navigate(`/manga/${manga._id}`);
  };

  const handlePreview = (manga: Manga) => {
    setSelectedManga(manga);
    setShowPreview(true);
  };

  const handleToggleFollow = async (mangaId: string, follow: boolean) => {
    try {
      if (follow) await userService.followManga({ mangaId });
      else await userService.unfollowManga(mangaId);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
      throw err;
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedManga(null);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && mangas.length === 0) {
    return (
      <div className="py-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>Không tìm thấy truyện nào</EmptyTitle>
            <EmptyDescription>
              Thử thay đổi bộ lọc hoặc tiêu chí tìm kiếm của bạn
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Kết quả tìm kiếm
            </h2>
            <p className="text-sm text-muted-foreground">
              Tìm thấy {totalResults} truyện
            </p>
          </div>
          {totalPages > 1 && (
            <p className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mangas.map((manga, index) => (
            <div
              key={manga._id}
              onClick={() => handleMangaClick(manga, index)}
              className="cursor-pointer"
            >
              <MangaCard
                manga={manga}
                size="sm"
                onPreview={handlePreview}
                onToggleFollow={handleToggleFollow}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className="w-9"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Preview Pane */}
      <PreviewPane
        show={showPreview}
        manga={selectedManga}
        onClose={handleClosePreview}
      />
    </>
  );
};
