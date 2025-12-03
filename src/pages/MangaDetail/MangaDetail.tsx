import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { mangaService } from "@/services/manga.service";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import type { Manga, Genre, Chapter } from "@/types";
import {
  MangaInfo,
  ChapterList,
  MangaDetailSkeleton,
  MangaDetailError,
  RatingSection,
} from "./components";
import { CommentSection } from "@/components/common/CommentSection";
import { toast } from "sonner";

export function MangaDetail() {
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
      checkIfFollowing(id);
    }
  }, [id]);

  const checkIfFollowing = async (mangaId: string) => {
    if (!authService.isAuthenticated()) {
      setIsFollowing(false);
      return;
    }

    try {
      const profile = await userService.getMyProfile();
      if (profile?.followedMangas) {
        setIsFollowing(profile.followedMangas.includes(mangaId));
      }
    } catch (error) {
      console.error("Failed to check follow status:", error);
    }
  };

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

  const handleFollowToggle = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để theo dõi truyện");
      navigate("/login");
      return;
    }

    if (!id) return;

    try {
      if (isFollowing) {
        await userService.unfollowManga(id);
        setIsFollowing(false);
        toast.success("Đã hủy theo dõi truyện");
      } else {
        await userService.followManga({ mangaId: id });
        setIsFollowing(true);
        toast.success("Đã theo dõi truyện");
      }

      // Refresh manga data to get updated follower count
      fetchMangaDetail(id);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
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
      toast.success("Đã sao chép liên kết!");
    }
  };

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/reader/${chapters[0]._id}`);
    }
  };

  const handleChapterClick = (chapterId: string) => {
    navigate(`/reader/${chapterId}`);
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
        <div className="mb-8">
          <ChapterList
            chapters={chapters}
            onChapterClick={handleChapterClick}
          />
        </div>

        {/* Rating Section */}
        <div className="mb-8">
          <RatingSection
            mangaId={id!}
            initialAverageRating={manga.averageRating}
            initialTotalRatings={0}
          />
        </div>

        {/* Comments Section */}
        <CommentSection mangaId={id} />
      </div>
    </MainLayout>
  );
}
