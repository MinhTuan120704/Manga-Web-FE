import { useState, useEffect } from "react";
import type { Chapter } from "@/types";
import type { ReaderSettings } from "../MangaReader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Image cache to store blob URLs
const imageCache = new Map<string, string>();

const loadAndCacheImage = async (url: string): Promise<string> => {
  // Check if already cached
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    imageCache.set(url, blobUrl);

    return blobUrl;
  } catch (error) {
    console.error("Failed to cache image:", error);
    // Fallback to original URL if fetch fails
    return url;
  }
};

interface ReaderContentProps {
  chapter: Chapter;
  currentPage: number;
  settings: ReaderSettings;
  showNavigation?: boolean;
  showHeader?: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function ReaderContent({
  chapter,
  currentPage,
  settings,
  showNavigation = true,
  showHeader = true,
  onNextPage,
  onPreviousPage,
}: ReaderContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setImageLoaded(false);
    setCurrentImageUrls([]);
  }, [currentPage]);

  // Preload current page images and convert to blob URLs
  useEffect(() => {
    const currentPages = getCurrentPages();

    Promise.all(currentPages.map((page) => loadAndCacheImage(page.image))).then(
      (blobUrls) => {
        setCurrentImageUrls(blobUrls);
        setImageLoaded(true);
      }
    );
    // Dont delete the comment below and add any more dependency, that would cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    settings.readingMode,
    settings.readingDirection,
    settings.doublePageOffset,
    chapter._id,
  ]);

  // Preload next pages for smoother transitions
  useEffect(() => {
    if (settings.readingMode === "long-strip") return;

    const preloadNextPages = async () => {
      const maxPages = chapter.pages.length;
      let pagesToPreload: number[] = [];

      if (settings.readingMode === "double") {
        // Preload next 2 pages (next pair)
        if (settings.doublePageOffset) {
          if (currentPage === 1) {
            pagesToPreload = [2, 3];
          } else {
            const effectivePage = currentPage - 1;
            const isFirstOfPair = effectivePage % 2 === 1;
            if (isFirstOfPair) {
              // Currently showing 2 pages, preload next 2
              const nextPage = currentPage + 2;
              pagesToPreload = [nextPage, nextPage + 1];
            } else {
              const nextPage = currentPage + 1;
              pagesToPreload = [nextPage, nextPage + 1];
            }
          }
        } else {
          // No offset
          const isFirstOfPair = currentPage % 2 === 1;
          if (isFirstOfPair) {
            const nextPage = currentPage + 2;
            pagesToPreload = [nextPage, nextPage + 1];
          } else {
            const nextPage = currentPage + 1;
            pagesToPreload = [nextPage, nextPage + 1];
          }
        }
      } else {
        // Single page mode - preload next 2 pages
        pagesToPreload = [currentPage + 1, currentPage + 2];
      }

      // Filter valid page numbers and preload with cache
      const validPages = pagesToPreload.filter(
        (pageNum) => pageNum > 0 && pageNum <= maxPages
      );

      // Preload images in parallel using cache (blob URLs)
      await Promise.allSettled(
        validPages.map((pageNum) =>
          loadAndCacheImage(chapter.pages[pageNum - 1].image)
        )
      );
    };

    preloadNextPages();
  }, [
    currentPage,
    settings.readingMode,
    settings.doublePageOffset,
    chapter.pages,
  ]);

  const getCurrentPages = () => {
    if (settings.readingMode === "long-strip") {
      return chapter.pages;
    }

    if (settings.readingMode === "double") {
      const pages = [];
      const startIdx = currentPage - 1;

      // Calculate effective page number with offset
      const effectivePage = settings.doublePageOffset
        ? currentPage
        : currentPage - 1;
      const isOddPage = effectivePage % 2 === 1;

      if (settings.readingDirection === "rtl") {
        if (settings.doublePageOffset) {
          if (currentPage === 1) {
            pages.push(chapter.pages[0]);
          } else if (isOddPage) {
            pages.push(chapter.pages[startIdx]);
            if (startIdx + 1 < chapter.pages.length) {
              pages.push(chapter.pages[startIdx + 1]);
            }
          } else {
            pages.push(chapter.pages[startIdx]);
          }
        } else {
          if (startIdx > 0) {
            pages.push(chapter.pages[startIdx - 1]);
            pages.push(chapter.pages[startIdx]);
          } else {
            pages.push(chapter.pages[startIdx]);
          }
        }
      } else {
        if (settings.doublePageOffset) {
          if (currentPage === 1) {
            pages.push(chapter.pages[0]);
          } else if (isOddPage) {
            pages.push(chapter.pages[startIdx]);
            if (startIdx + 1 < chapter.pages.length) {
              pages.push(chapter.pages[startIdx + 1]);
            }
          } else {
            pages.push(chapter.pages[startIdx]);
          }
        } else {
          pages.push(chapter.pages[startIdx]);
          if (startIdx + 1 < chapter.pages.length) {
            pages.push(chapter.pages[startIdx + 1]);
          }
        }
      }

      return pages;
    }

    // Single page
    return [chapter.pages[currentPage - 1]];
  };

  const pages = getCurrentPages();

  if (settings.readingMode === "long-strip") {
    return (
      <div
        className={`flex flex-col items-center ${
          showNavigation ? "pb-24" : "pb-4"
        }`}
      >
        {chapter.pages.map((page, index) => (
          <div
            key={page.pageNumber}
            className="w-full max-w-2xl flex justify-center"
          >
            <img
              src={page.image}
              alt={`Page ${page.pageNumber}`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-auto"
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    );
  }

  // Single or Double page mode
  return (
    <div
      className={`relative w-full ${
        showHeader && showNavigation
          ? "min-h-[calc(100vh-64px-80px)]"
          : showHeader
          ? "min-h-[calc(100vh-64px)]"
          : showNavigation
          ? "min-h-[calc(100vh-80px)]"
          : "min-h-screen"
      } flex items-center justify-center py-4`}
    >
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousPage}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white dark:bg-white/20 dark:hover:bg-white/40 dark:text-white"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      {/* Pages Container */}
      <div
        className={`flex ${
          settings.readingDirection === "rtl" ? "flex-row-reverse" : "flex-row"
        } gap-0 items-center justify-center w-full h-full px-2 sm:px-4`}
      >
        {pages.map((page, index) => {
          // Use blob URL if available, otherwise fallback to original
          const imageSrc = currentImageUrls[index] || page.image;

          return (
            <div
              key={page.pageNumber}
              className={`relative flex items-center justify-center ${
                settings.readingMode === "double" ? "" : "flex-1"
              } h-full`}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
              )}
              <img
                src={imageSrc}
                alt={`Page ${page.pageNumber}`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer-when-downgrade"
                className={`${
                  settings.fitMode === "fit-width"
                    ? "w-full h-auto"
                    : settings.fitMode === "fit-height"
                    ? showHeader && showNavigation
                      ? "w-auto h-[calc(100vh-180px)]"
                      : showHeader
                      ? "w-auto h-[calc(100vh-100px)]"
                      : showNavigation
                      ? "w-auto h-[calc(100vh-116px)]"
                      : "w-auto h-[calc(100vh-36px)]"
                    : showHeader && showNavigation
                    ? "w-auto h-auto max-h-[calc(100vh-180px)]"
                    : showHeader
                    ? "w-auto h-auto max-h-[calc(100vh-100px)]"
                    : showNavigation
                    ? "w-auto h-auto max-h-[calc(100vh-116px)]"
                    : "w-auto h-auto max-h-[calc(100vh-36px)]"
                } object-contain ${
                  settings.readingMode === "double" &&
                  pages.length === 2 &&
                  index === 0
                    ? settings.readingDirection === "rtl"
                      ? "border-l border-border/30"
                      : "border-r border-border/30"
                    : ""
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextPage}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white dark:bg-white/20 dark:hover:bg-white/40 dark:text-white"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Click Areas for Navigation */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer z-[5]"
        onClick={
          settings.readingDirection === "ltr" ? onPreviousPage : onNextPage
        }
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer z-[5]"
        onClick={
          settings.readingDirection === "ltr" ? onNextPage : onPreviousPage
        }
      />
    </div>
  );
}
