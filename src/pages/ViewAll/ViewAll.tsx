import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { mangaService } from "@/services/manga.service";
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

export const ViewAll = () => {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "newest";

  // State
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);

  // Get title based on sortBy
  const getTitle = () => {
    switch (sortBy) {
      case "newest":
        return "Mới nhất";
      case "oldest":
        return "Cũ nhất";
      case "mostViewed":
        return "Xem nhiều nhất";
      case "highestRating":
        return "Đánh giá cao nhất";
      case "mostFollowed":
        return "Theo dõi nhiều nhất";
      case "az":
        return "A-Z";
      case "za":
        return "Z-A";
      case "updated":
        return "Cập nhật gần đây";
      default:
        return "Tất cả truyện";
    }
  };

  const getSubtitle = () => {
    switch (sortBy) {
      case "newest":
        return "Truyện mới phát hành";
      case "oldest":
        return "Truyện phát hành lâu nhất";
      case "mostViewed":
        return "Truyện được xem nhiều nhất";
      case "highestRating":
        return "Truyện có đánh giá cao nhất";
      case "mostFollowed":
        return "Truyện có nhiều người theo dõi nhất";
      case "az":
        return "Sắp xếp theo bảng chữ cái A-Z";
      case "za":
        return "Sắp xếp theo bảng chữ cái Z-A";
      case "updated":
        return "Truyện vừa cập nhật chapter mới";
      default:
        return "Danh sách tất cả truyện";
    }
  };

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: getTitle() },
  ];

  // Fetch mangas
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setLoading(true);
        const response = await mangaService.searchMangas({
          page: currentPage,
          limit: 24,
          sortBy: sortBy as
            | "newest"
            | "oldest"
            | "mostViewed"
            | "highestRating"
            | "mostFollowed"
            | "az"
            | "za"
            | "updated",
        });
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
  }, [currentPage, sortBy]);

  // Reset to page 1 when sortBy changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handlePreview = (manga: Manga) => {
    setSelectedManga(manga);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedManga(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <>
      <MainLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {getTitle()}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {getSubtitle()}
            </p>
          </div>

          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 24 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-48 w-full rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : mangas.length === 0 ? (
            // Empty state
            <div className="py-12">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookOpen />
                  </EmptyMedia>
                  <EmptyTitle>Không tìm thấy truyện nào</EmptyTitle>
                  <EmptyDescription>
                    Hiện chưa có truyện nào trong danh mục này
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            // Results
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Danh sách truyện
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
              {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      Đầu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Trước
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* First page */}
                    {currentPage > 3 && totalPages > 5 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className="w-9"
                        >
                          1
                        </Button>
                        {currentPage > 4 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Page numbers */}
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
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-9"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && totalPages > 5 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Cuối
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
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
};
