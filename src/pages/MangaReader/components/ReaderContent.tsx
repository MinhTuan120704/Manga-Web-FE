import { useState, useEffect } from "react";
import type { Chapter } from "@/types";
import type { ReaderSettings } from "../MangaReader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReaderContentProps {
  chapter: Chapter;
  currentPage: number;
  settings: ReaderSettings;
  showNavigation?: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function ReaderContent({
  chapter,
  currentPage,
  settings,
  showNavigation = true,
  onNextPage,
  onPreviousPage,
}: ReaderContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentPage]);

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
        // Right to left reading
        if (settings.doublePageOffset) {
          // First page is alone (cover), then pairs
          if (currentPage === 1) {
            // Show only first page (cover)
            pages.push(chapter.pages[0]);
          } else if (isOddPage) {
            // Odd pages: show current and next
            pages.push(chapter.pages[startIdx]);
            if (startIdx + 1 < chapter.pages.length) {
              pages.push(chapter.pages[startIdx + 1]);
            }
          } else {
            // Even pages: already shown with previous odd page
            // This shouldn't happen with proper navigation
            pages.push(chapter.pages[startIdx]);
          }
        } else {
          // Normal pairing: show current and previous
          if (startIdx > 0) {
            pages.push(chapter.pages[startIdx]);
            pages.push(chapter.pages[startIdx - 1]);
          } else {
            pages.push(chapter.pages[startIdx]);
          }
        }
      } else {
        // Left to right reading
        if (settings.doublePageOffset) {
          // First page is alone (cover), then pairs
          if (currentPage === 1) {
            // Show only first page (cover)
            pages.push(chapter.pages[0]);
          } else if (isOddPage) {
            // Odd pages: show current and next
            pages.push(chapter.pages[startIdx]);
            if (startIdx + 1 < chapter.pages.length) {
              pages.push(chapter.pages[startIdx + 1]);
            }
          } else {
            // Even pages: already shown with previous odd page
            pages.push(chapter.pages[startIdx]);
          }
        } else {
          // Normal pairing: show current and next
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
          <div key={page.pageNumber} className="w-full flex justify-center">
            <img
              src={page.image}
              alt={`Page ${page.pageNumber}`}
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
        showNavigation
          ? "min-h-[calc(100vh-64px-80px)]"
          : "min-h-[calc(100vh-64px)]"
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
        {pages.map((page, index) => (
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
              src={page.image}
              alt={`Page ${page.pageNumber}`}
              className={`${
                settings.fitMode === "fit-width"
                  ? "w-full h-auto"
                  : settings.fitMode === "fit-height"
                  ? showNavigation
                    ? "w-auto h-[calc(100vh-180px)]"
                    : "w-auto h-[calc(100vh-100px)]"
                  : showNavigation
                  ? "w-auto h-auto max-h-[calc(100vh-180px)]"
                  : "w-auto h-auto max-h-[calc(100vh-100px)]"
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
        ))}
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
