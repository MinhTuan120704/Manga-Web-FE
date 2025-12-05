import { useState } from "react";
import { MangaCard } from "@/components/common/MangaCard";
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
import type { Manga } from "@/types/manga";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface SearchResultsProps {
  mangas: Manga[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

export const SearchResults = ({
  mangas,
  loading,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
}: SearchResultsProps) => {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
          {mangas.map((manga) => (
            <MangaCard
              key={manga._id}
              manga={manga}
              size="sm"
              onPreview={handlePreview}
            />
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
