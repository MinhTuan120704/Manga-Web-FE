import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Chapter } from "@/types";
import type { ReaderSettings } from "../MangaReader";

interface ReaderNavigationProps {
  chapter: Chapter;
  allChapters: Chapter[];
  currentPage: number;
  totalPages: number;
  hasNextChapter: boolean;
  hasPreviousChapter: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
  onChapterSelect: (chapterId: string) => void;
  onPageChange: (page: number) => void;
  settings: ReaderSettings;
}

export function ReaderNavigation({
  chapter,
  allChapters,
  currentPage,
  totalPages,
  hasNextChapter,
  hasPreviousChapter,
  onNextPage,
  onPreviousPage,
  onNextChapter,
  onPreviousChapter,
  onChapterSelect,
  onPageChange,
  settings,
}: ReaderNavigationProps) {
  // Determine if RTL mode
  const isRTL = settings.readingDirection === "rtl";

  if (settings.readingMode === "long-strip") {
    // Simplified navigation for long-strip mode
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-sm bg-background/90 border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={isRTL ? onNextChapter : onPreviousChapter}
              disabled={isRTL ? !hasNextChapter : !hasPreviousChapter}
              className="flex items-center gap-2"
            >
              {isRTL ? (
                <>
                  <ChevronsRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Next Chapter</span>
                </>
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous Chapter</span>
                </>
              )}
            </Button>

            <Select value={chapter._id} onValueChange={onChapterSelect}>
              <SelectTrigger className="w-[200px] sm:w-[300px]">
                <SelectValue>
                  Ch. {chapter.chapterNumber}
                  {chapter.title && ` - ${chapter.title}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {allChapters.map((ch) => (
                  <SelectItem key={ch._id} value={ch._id}>
                    Chapter {ch.chapterNumber}
                    {ch.title && ` - ${ch.title}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={isRTL ? onPreviousChapter : onNextChapter}
              disabled={isRTL ? !hasPreviousChapter : !hasNextChapter}
              className="flex items-center gap-2"
            >
              {isRTL ? (
                <>
                  <span className="hidden sm:inline">Previous Chapter</span>
                  <ChevronsLeft className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Next Chapter</span>
                  <ChevronsRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full navigation for single/double page mode
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-sm bg-background/90 border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Page Slider */}
          <div
            className={`flex items-center gap-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Badge variant="outline" className="min-w-[80px] justify-center">
              {currentPage} / {totalPages}
            </Badge>
            <Slider
              value={[currentPage]}
              onValueChange={(values: number[]) => onPageChange(values[0])}
              min={1}
              max={totalPages}
              step={1}
              className="flex-1"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Left side buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isRTL ? onNextChapter : onPreviousChapter}
                disabled={isRTL ? !hasNextChapter : !hasPreviousChapter}
                className="hidden sm:flex items-center gap-2"
              >
                {isRTL ? (
                  <>
                    <ChevronsRight className="h-4 w-4" />
                    Next Chapter
                  </>
                ) : (
                  <>
                    <ChevronsLeft className="h-4 w-4" />
                    Prev Chapter
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={isRTL ? onNextChapter : onPreviousChapter}
                disabled={isRTL ? !hasNextChapter : !hasPreviousChapter}
                className="sm:hidden"
              >
                {isRTL ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={isRTL ? onNextPage : onPreviousPage}
                disabled={
                  isRTL ? currentPage === totalPages : currentPage === 1
                }
              >
                {isRTL ? (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Next</span>
                  </>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Prev</span>
                  </>
                )}
              </Button>
            </div>

            {/* Chapter Selector */}
            <Select value={chapter._id} onValueChange={onChapterSelect}>
              <SelectTrigger className="w-[150px] sm:w-[250px]">
                <SelectValue>
                  <span className="truncate">
                    Ch. {chapter.chapterNumber}
                    {chapter.title && (
                      <span className="hidden sm:inline">
                        {" "}
                        - {chapter.title}
                      </span>
                    )}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {allChapters.map((ch) => (
                  <SelectItem key={ch._id} value={ch._id}>
                    Chapter {ch.chapterNumber}
                    {ch.title && ` - ${ch.title}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isRTL ? onPreviousPage : onNextPage}
                disabled={
                  isRTL ? currentPage === 1 : currentPage === totalPages
                }
              >
                {isRTL ? (
                  <>
                    <span className="hidden sm:inline mr-1">Prev</span>
                    <ChevronLeft className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={isRTL ? onPreviousChapter : onNextChapter}
                disabled={isRTL ? !hasPreviousChapter : !hasNextChapter}
                className="hidden sm:flex items-center gap-2"
              >
                {isRTL ? (
                  <>
                    Prev Chapter
                    <ChevronsLeft className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Chapter
                    <ChevronsRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={isRTL ? onPreviousChapter : onNextChapter}
                disabled={isRTL ? !hasPreviousChapter : !hasNextChapter}
                className="sm:hidden"
              >
                {isRTL ? (
                  <ChevronsLeft className="h-4 w-4" />
                ) : (
                  <ChevronsRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
