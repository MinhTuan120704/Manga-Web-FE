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
  if (settings.readingMode === "long-strip") {
    // Simplified navigation for long-strip mode
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-sm ${
          settings.backgroundColor === "white"
            ? "bg-white/90 border-gray-200"
            : settings.backgroundColor === "black"
            ? "bg-black/90 border-gray-800"
            : "bg-gray-900/90 border-gray-700"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onPreviousChapter}
              disabled={!hasPreviousChapter}
              className="flex items-center gap-2"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous Chapter</span>
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
              onClick={onNextChapter}
              disabled={!hasNextChapter}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline">Next Chapter</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Full navigation for single/double page mode
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-sm ${
        settings.backgroundColor === "white"
          ? "bg-white/90 border-gray-200"
          : settings.backgroundColor === "black"
          ? "bg-black/90 border-gray-800"
          : "bg-gray-900/90 border-gray-700"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Page Slider */}
          <div className="flex items-center gap-4">
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
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousChapter}
                disabled={!hasPreviousChapter}
                className="hidden sm:flex items-center gap-2"
              >
                <ChevronsLeft className="h-4 w-4" />
                Prev Chapter
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onPreviousChapter}
                disabled={!hasPreviousChapter}
                className="sm:hidden"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Prev</span>
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={currentPage === totalPages}
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onNextChapter}
                disabled={!hasNextChapter}
                className="hidden sm:flex items-center gap-2"
              >
                Next Chapter
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onNextChapter}
                disabled={!hasNextChapter}
                className="sm:hidden"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
