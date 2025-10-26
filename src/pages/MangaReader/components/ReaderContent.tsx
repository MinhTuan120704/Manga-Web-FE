import { useState, useEffect } from "react";
import type { Chapter } from "@/types";
import type { ReaderSettings } from "../MangaReader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReaderContentProps {
  chapter: Chapter;
  currentPage: number;
  settings: ReaderSettings;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function ReaderContent({
  chapter,
  currentPage,
  settings,
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

      if (settings.readingDirection === "rtl") {
        // Right to left: show current and previous page
        if (startIdx > 0) {
          pages.push(chapter.pages[startIdx]);
          pages.push(chapter.pages[startIdx - 1]);
        } else {
          pages.push(chapter.pages[startIdx]);
        }
      } else {
        // Left to right: show current and next page
        pages.push(chapter.pages[startIdx]);
        if (startIdx + 1 < chapter.pages.length) {
          pages.push(chapter.pages[startIdx + 1]);
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
      <div className="flex flex-col items-center pb-24">
        {chapter.pages.map((page, index) => (
          <div key={page.pageNumber} className="w-full flex justify-center">
            <img
              src={page.image}
              alt={`Page ${page.pageNumber}`}
              className="max-w-full h-auto"
              loading={index < 3 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    );
  }

  // Single or Double page mode
  return (
    <div className="relative min-h-[calc(100vh-64px-80px)] flex items-center justify-center py-8">
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousPage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white"
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      {/* Pages Container */}
      <div
        className={`flex ${
          settings.readingDirection === "rtl" ? "flex-row-reverse" : "flex-row"
        } gap-4 items-start justify-center px-4`}
      >
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            className="relative flex items-center justify-center"
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
              </div>
            )}
            <img
              src={page.image}
              alt={`Page ${page.pageNumber}`}
              className={`max-h-[calc(100vh-200px)] ${
                settings.fitMode === "fit-width"
                  ? "w-full max-w-4xl"
                  : settings.fitMode === "fit-height"
                  ? "h-[calc(100vh-200px)]"
                  : "max-w-full"
              } object-contain`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextPage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Click Areas for Navigation */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-[5]"
        onClick={
          settings.readingDirection === "ltr" ? onPreviousPage : onNextPage
        }
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-[5]"
        onClick={
          settings.readingDirection === "ltr" ? onNextPage : onPreviousPage
        }
      />
    </div>
  );
}
