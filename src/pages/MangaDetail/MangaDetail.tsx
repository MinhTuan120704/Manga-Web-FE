import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { mangaService } from "@/services/manga.service";
import type { Manga } from "@/types/manga";
import {
  MangaInfo,
  ChapterList,
  MangaDetailSkeleton,
  MangaDetailError,
} from "./components";
import type { Chapter } from "@/types/chapter";
import type { Genre } from "@/types/genre";

export default function MangaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMangaDetail(id);
      fetchChapters(id);
    }
  }, [id]);

  const fetchMangaDetail = async (mangaId: string) => {
    try {
      setLoading(true);
      const response = await mangaService.getMangaById(mangaId);
      if (response.data) {
        setManga(response.data);
      }
    } catch (err) {
      setError("Failed to load manga details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (mangaId: string) => {
    try {
      const response = await mangaService.getChaptersByMangaId(mangaId);
      if (response.data) {
        setChapters(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Failed to load chapters:", err);
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow manga
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: manga?.title,
        text: manga?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/chapter/${chapters[0]._id}`);
    }
  };

  const handleChapterClick = (chapterId: string) => {
    navigate(`/chapter/${chapterId}`);
  };

  const getGenreNames = (genres: Genre[] | string[]): Genre[] => {
    return genres.map((genre) =>
      typeof genre === "string" ? { _id: genre, name: genre } : genre
    ) as Genre[];
  };

  if (loading) {
    return <MangaDetailSkeleton />;
  }

  if (error || !manga) {
    return (
      <MangaDetailError
        error={error || undefined}
        onReturnHome={() => navigate("/")}
      />
    );
  }

  const genres = getGenreNames(manga.genres);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Manga Info Section */}
        <div className="mb-8">
          <MangaInfo
            coverImage={manga.coverImage}
            title={manga.title}
            status={manga.status}
            author={manga.author}
            artist={manga.artist}
            createdAt={manga.createdAt}
            description={manga.description}
            genres={genres}
            averageRating={manga.averageRating}
            viewCount={manga.viewCount}
            followerCount={manga.followerCount}
            chaptersCount={chapters.length}
            isFollowing={isFollowing}
            onStartReading={handleStartReading}
            onFollowToggle={handleFollowToggle}
            onShare={handleShare}
          />
        </div>

        {/* Chapters Section */}
        <ChapterList chapters={chapters} onChapterClick={handleChapterClick} />
      </div>
    </MainLayout>
  );
}
