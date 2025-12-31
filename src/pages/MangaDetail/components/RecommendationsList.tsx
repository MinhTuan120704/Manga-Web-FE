import { useEffect, useState } from "react";
import { mangaService } from "@/services/manga.service";
import type { RecommendationsRawData, RecommendationItem } from "@/types/api";
import { MangaCard } from "@/components/common/MangaCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Manga } from "@/types/manga";
import type { Genre } from "@/types/genre";
import type { User } from "@/types/user";

interface Props {
  mangaId: string;
  limit?: number;
}

export function RecommendationsList({ mangaId, limit = 8 }: Props) {
  const [data, setData] = useState<RecommendationsRawData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await mangaService.getRecommendations(mangaId, limit);
        if (!mounted) return;
        setData(res);
      } catch (err: unknown) {
        if (!mounted) return;
        const message =
          typeof err === "object" && err !== null && "message" in err
            ? String((err as { message?: unknown }).message)
            : String(err ?? "Không thể tải đề xuất");
        setError(message || "Không thể tải đề xuất");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (mangaId) fetch();
    return () => {
      mounted = false;
    };
  }, [mangaId, limit]);

  const mapToManga = (item: RecommendationItem): Manga => {
    const genres: Genre[] = (item.genres || []).map((g) => ({
      _id: g._id,
      name: g.name,
    }));

    const uploader =
      typeof item.uploaderId === "object" && item.uploaderId !== null
        ? (item.uploaderId as unknown as User)
        : (item.uploaderId as unknown as string | undefined);

    return {
      _id: item._id,
      title: item.title,
      description: item.description ?? "",
      coverImage: item.coverImage ?? item.coverImageUrl ?? "",
      author: item.author ?? "",
      artist: undefined,
      genres: genres,
      status: (item.status ?? "ongoing") as Manga["status"],
      uploaderId: uploader,
      viewCount: item.viewCount,
      followerCount: item.followedCount,
      averageRating: item.averageRating,
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? new Date().toISOString(),
      progress: item.progress,
      chapterCount: item.chapterCount,
      followedCount: item.followedCount,
    } as Manga;
  };

  if (loading)
    return (
      <Card className="mb-6 p-4 sm:p-6 bg-card/60 border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h4 className="text-base font-semibold text-foreground">Có thể bạn cũng thích</h4>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Đang tải đề xuất...</div>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className="my-6 p-4 sm:p-6 bg-card border-border shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h4 className="text-base font-semibold text-foreground">Có thể bạn cũng thích</h4>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">{error}</div>
        </CardContent>
      </Card>
    );

  if (!data || !data.recommendations || data.recommendations.length === 0)
    return null;

  return (
    <Card className="my-8 bg-card border-border rounded-lg shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Có thể bạn cũng thích</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {data.recommendations.map((r) => (
            <MangaCard key={r._id} manga={mapToManga(r)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecommendationsList;
