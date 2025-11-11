import { ArrowLeft, Settings, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Manga, Chapter } from "@/types";
import type { ReaderSettings } from "../MangaReader";

interface ReaderHeaderProps {
  manga: Manga | null;
  chapter: Chapter;
  currentPage: number;
  totalPages: number;
  onReturnToManga: () => void;
  onToggleSettings: () => void;
  onToggleNavigation: () => void;
  showNavigation?: boolean;
  settings: ReaderSettings;
}

export function ReaderHeader({
  manga,
  chapter,
  currentPage,
  totalPages,
  onReturnToManga,
  onToggleSettings,
  onToggleNavigation,
  showNavigation = true,
  settings,
}: ReaderHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-sm bg-background/80 border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={onReturnToManga}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col min-w-0">
              <h1 className="font-semibold truncate text-sm sm:text-base text-foreground">
                {manga?.title || "Loading..."}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Ch. {chapter.chapterNumber}
                </span>
                {chapter.title && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground truncate max-w-[150px] sm:max-w-[300px]">
                      {chapter.title}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Page counter and controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {settings.showPageNumber &&
              settings.readingMode !== "long-strip" && (
                <Badge variant="outline" className="hidden sm:inline-flex">
                  {currentPage} / {totalPages}
                </Badge>
              )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleNavigation}
              className={showNavigation ? "bg-accent" : ""}
              title="Toggle Navigation (N)"
            >
              <List className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSettings}
              title="Settings (S)"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
