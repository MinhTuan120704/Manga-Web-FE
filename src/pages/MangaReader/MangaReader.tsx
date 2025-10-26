import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { chapterService } from "@/services/chapter.service";
import { mangaService } from "@/services/manga.service";
import type { Chapter, Manga } from "@/types";
import {
  ReaderHeader,
  ReaderSettings,
  ReaderContent,
  ReaderNavigation,
  ReaderSkeleton,
  ReaderError,
} from "./components";

export type ReadingMode = "single" | "double" | "long-strip";
export type ReadingDirection = "ltr" | "rtl";

export interface ReaderSettings {
  readingMode: ReadingMode;
  readingDirection: ReadingDirection;
  fitMode: "fit-width" | "fit-height" | "original";
  showPageNumber: boolean;
  backgroundColor: "white" | "black" | "gray";
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
  const [showNavigation, setShowNavigation] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>({
    readingMode: "single",
    readingDirection: "ltr",
    fitMode: "fit-width",
    showPageNumber: true,
    backgroundColor: "gray",
  });

  // Fetch chapter data
  useEffect(() => {
    if (chapterId) {
      fetchChapterData(chapterId);
    }
  }, [chapterId]);

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

      // Fetch manga details and all chapters
      const [mangaResponse, chaptersResponse] = await Promise.all([
        mangaService.getMangaById(chapterData.mangaId),
        mangaService.getChaptersByMangaId(chapterData.mangaId),
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

    if (currentPage < chapter.pages.length) {
      setCurrentPage((prev) => prev + 1);
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
  }, [chapter, currentPage, allChapters, navigate]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
  }, [currentPage, chapter, allChapters, navigate]);

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
    setSettings((prev: ReaderSettings) => ({ ...prev, ...newSettings }));
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
    <div
      className={`min-h-screen ${
        settings.backgroundColor === "white"
          ? "bg-white"
          : settings.backgroundColor === "black"
          ? "bg-black"
          : "bg-gray-900"
      }`}
    >
      {/* Header */}
      <ReaderHeader
        manga={manga}
        chapter={chapter}
        currentPage={currentPage}
        totalPages={chapter.pages.length}
        onReturnToManga={handleReturnToManga}
        onToggleSettings={() => setShowSettings((prev) => !prev)}
        onToggleNavigation={() => setShowNavigation((prev) => !prev)}
        settings={settings}
      />

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
        onPageChange={setCurrentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />

      {/* Bottom Navigation */}
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
    </div>
  );
}
