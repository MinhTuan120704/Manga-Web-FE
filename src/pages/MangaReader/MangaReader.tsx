import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chapterService } from "@/services/chapter.service";
import { mangaService } from "@/services/manga.service";
import type { Chapter, Manga } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ReaderHeader,
  ReaderSettings,
  ReaderContent,
  ReaderNavigation,
  ReaderSkeleton,
  ReaderError,
  ReadingDirectionOverlay,
} from "./components";

export type ReadingMode = "single" | "double" | "long-strip";
export type ReadingDirection = "ltr" | "rtl";

export interface ReaderSettings {
  readingMode: ReadingMode;
  readingDirection: ReadingDirection;
  fitMode: "fit-width" | "fit-height" | "original";
  showPageNumber: boolean;
  doublePageOffset: boolean;
}

export function MangaReader() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  // Data states
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [manga, setManga] = useState<Manga | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reader states
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showDirectionOverlay, setShowDirectionOverlay] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    readingMode: "double",
    readingDirection: "rtl",
    fitMode: "fit-height",
    showPageNumber: true,
    doublePageOffset: false,
  });

  // Fetch chapter data
  useEffect(() => {
    if (chapterId) {
      fetchChapterData(chapterId);
    }
  }, [chapterId]);

  // Show direction overlay when chapter loads
  useEffect(() => {
    if (chapter && !loading) {
      setShowDirectionOverlay(true);
    }
  }, [chapter, loading]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("manga-reader-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error("Failed to load reader settings:", err);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("manga-reader-settings", JSON.stringify(settings));
  }, [settings]);

  const fetchChapterData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch chapter details
      const chapterResponse = await chapterService.getChapterById(id);
      if (!chapterResponse.data) {
        throw new Error("Chapter not found");
      }

      const chapterData = chapterResponse.data;
      setChapter(chapterData);

      const mangaId =
        typeof chapterData.mangaId === "string"
          ? chapterData.mangaId
          : chapterData.mangaId._id;

      // Fetch manga details and all chapters
      const [mangaResponse, chaptersResponse] = await Promise.all([
        mangaService.getMangaById(mangaId),
        mangaService.getChaptersByMangaId(mangaId),
      ]);

      if (mangaResponse.data) {
        setManga(mangaResponse.data);
      }

      if (chaptersResponse.data) {
        const chapters = Array.isArray(chaptersResponse.data)
          ? chaptersResponse.data
          : [];
        setAllChapters(
          chapters.sort((a, b) => a.chapterNumber - b.chapterNumber)
        );
      }
    } catch (err) {
      console.error("Failed to load chapter:", err);
      setError("Failed to load chapter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = useCallback(() => {
    if (!chapter) return;

    // Calculate pages to skip based on reading mode
    let pagesToSkip = 1;
    if (settings.readingMode === "double") {
      if (settings.doublePageOffset) {
        // With offset: page 1 alone, then pairs (2-3, 4-5, 6-7...)
        if (currentPage === 1) {
          pagesToSkip = 1; // Jump from 1 to 2
        } else {
          const effectivePage = currentPage - 1; // Adjust for offset
          const isFirstOfPair = effectivePage % 2 === 1;
          pagesToSkip = isFirstOfPair ? 2 : 1;
        }
      } else {
        // No offset: pairs (1-2, 3-4, 5-6...)
        const isFirstOfPair = currentPage % 2 === 1;
        pagesToSkip = isFirstOfPair ? 2 : 1;
      }
    }

    if (currentPage + pagesToSkip <= chapter.pages.length) {
      setCurrentPage((prev) => prev + pagesToSkip);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentPage < chapter.pages.length) {
      // Jump to last page if we can't skip full pages
      setCurrentPage(chapter.pages.length);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Go to next chapter
      const currentIndex = allChapters.findIndex(
        (ch) => ch._id === chapter._id
      );
      if (currentIndex >= 0 && currentIndex < allChapters.length - 1) {
        const nextChapter = allChapters[currentIndex + 1];
        navigate(`/reader/${nextChapter._id}`);
        setCurrentPage(1);
      }
    }
  }, [
    chapter,
    currentPage,
    allChapters,
    navigate,
    settings.readingMode,
    settings.doublePageOffset,
  ]);

  const handlePreviousPage = useCallback(() => {
    // Calculate pages to skip based on reading mode
    let pagesToSkip = 1;
    if (settings.readingMode === "double") {
      if (settings.doublePageOffset) {
        // With offset: page 1 alone, then pairs (2-3, 4-5, 6-7...)
        if (currentPage === 2) {
          pagesToSkip = 1; // Jump from 2 to 1
        } else if (currentPage > 2) {
          const effectivePage = currentPage - 1; // Adjust for offset
          const isFirstOfPair = effectivePage % 2 === 1;
          pagesToSkip = isFirstOfPair ? 1 : 2;
        }
      } else {
        // No offset: pairs (1-2, 3-4, 5-6...)
        const isFirstOfPair = currentPage % 2 === 1;
        pagesToSkip = isFirstOfPair ? 2 : 1;
      }
    }

    if (currentPage - pagesToSkip >= 1) {
      setCurrentPage((prev) => prev - pagesToSkip);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentPage > 1) {
      // Jump to first page
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Go to previous chapter
      if (!chapter || allChapters.length === 0) return;
      const currentIndex = allChapters.findIndex(
        (ch) => ch._id === chapter._id
      );
      if (currentIndex > 0) {
        const prevChapter = allChapters[currentIndex - 1];
        navigate(`/reader/${prevChapter._id}`);
        setCurrentPage(1);
      }
    }
  }, [
    currentPage,
    chapter,
    allChapters,
    navigate,
    settings.readingMode,
    settings.doublePageOffset,
  ]);

  const handleNextChapter = () => {
    if (!chapter || allChapters.length === 0) return;

    const currentIndex = allChapters.findIndex((ch) => ch._id === chapter._id);
    if (currentIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentIndex + 1];
      navigate(`/reader/${nextChapter._id}`);
      setCurrentPage(1);
    }
  };

  const handlePreviousChapter = () => {
    if (!chapter || allChapters.length === 0) return;

    const currentIndex = allChapters.findIndex((ch) => ch._id === chapter._id);
    if (currentIndex > 0) {
      const prevChapter = allChapters[currentIndex - 1];
      navigate(`/reader/${prevChapter._id}`);
      setCurrentPage(1);
    }
  };

  const handleChapterSelect = (selectedChapterId: string) => {
    navigate(`/reader/${selectedChapterId}`);
    setCurrentPage(1);
    setShowNavigation(false);
  };

  const handleReturnToManga = () => {
    if (manga) {
      navigate(`/manga/${manga._id}`);
    } else {
      navigate("/");
    }
  };

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev: ReaderSettings) => {
      const updated = { ...prev, ...newSettings };

      // Show overlay if reading direction changed
      if (
        newSettings.readingDirection &&
        newSettings.readingDirection !== prev.readingDirection
      ) {
        setShowDirectionOverlay(true);
      }

      return updated;
    });
  };

  const getCurrentChapterIndex = () => {
    if (!chapter || allChapters.length === 0) return -1;
    return allChapters.findIndex((ch) => ch._id === chapter._id);
  };

  const hasNextChapter = () => {
    const index = getCurrentChapterIndex();
    return index >= 0 && index < allChapters.length - 1;
  };

  const hasPreviousChapter = () => {
    const index = getCurrentChapterIndex();
    return index > 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSettings) return; // Don't navigate when settings panel is open

      switch (e.key) {
        case "ArrowRight":
          if (settings.readingDirection === "ltr") {
            handleNextPage();
          } else {
            handlePreviousPage();
          }
          break;
        case "ArrowLeft":
          if (settings.readingDirection === "ltr") {
            handlePreviousPage();
          } else {
            handleNextPage();
          }
          break;
        case "ArrowUp":
          if (settings.readingMode === "long-strip") {
            window.scrollBy({ top: -200, behavior: "smooth" });
          }
          break;
        case "ArrowDown":
          if (settings.readingMode === "long-strip") {
            window.scrollBy({ top: 200, behavior: "smooth" });
          }
          break;
        case "Home":
          setCurrentPage(1);
          break;
        case "End":
          if (chapter) {
            setCurrentPage(chapter.pages.length);
          }
          break;
        case "s":
        case "S":
          setShowSettings((prev) => !prev);
          break;
        case "n":
        case "N":
          setShowNavigation((prev) => !prev);
          break;
        case "h":
        case "H":
          setShowHeader((prev) => !prev);
          break;
        case "Escape":
          if (showSettings) {
            setShowSettings(false);
          } else if (showNavigation) {
            setShowNavigation(false);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentPage,
    chapter,
    settings,
    showSettings,
    showNavigation,
    handleNextPage,
    handlePreviousPage,
  ]);

  if (loading) {
    return <ReaderSkeleton />;
  }

  if (error || !chapter) {
    return (
      <ReaderError
        error={error || "Chapter not found"}
        onReturnToManga={handleReturnToManga}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Reading Direction Overlay */}
      <ReadingDirectionOverlay
        direction={settings.readingDirection}
        show={showDirectionOverlay}
      />

      {/* Toggle Header Button */}
      {!showSettings && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowHeader((prev) => !prev)}
          className="fixed top-4 right-4 z-100 h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-transform"
          title={showHeader ? "Hide header (H)" : "Show header (H)"}
        >
          {showHeader ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5 " />
          )}
        </Button>
      )}

      {/* Header */}
      {showHeader && (
        <ReaderHeader
          manga={manga}
          chapter={chapter}
          currentPage={currentPage}
          totalPages={chapter.pages.length}
          onReturnToManga={handleReturnToManga}
          onToggleSettings={() => setShowSettings((prev) => !prev)}
          onToggleNavigation={() => setShowNavigation((prev) => !prev)}
          showNavigation={showNavigation}
          settings={settings}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <ReaderSettings
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Reader Content */}
      <ReaderContent
        chapter={chapter}
        currentPage={currentPage}
        settings={settings}
        showNavigation={showNavigation}
        showHeader={showHeader}
        onPageChange={setCurrentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />

      {/* Bottom Navigation */}
      {showNavigation && (
        <ReaderNavigation
          chapter={chapter}
          allChapters={allChapters}
          currentPage={currentPage}
          totalPages={chapter.pages.length}
          hasNextChapter={hasNextChapter()}
          hasPreviousChapter={hasPreviousChapter()}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onNextChapter={handleNextChapter}
          onPreviousChapter={handlePreviousChapter}
          onChapterSelect={handleChapterSelect}
          onPageChange={setCurrentPage}
          settings={settings}
        />
      )}
    </div>
  );
}
