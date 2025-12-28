import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MangaCard } from "@/components/common/MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mangaService } from "@/services/manga.service";
import { genreService } from "@/services/genre.service";
import type { Manga, MangaSearchParams } from "@/types/manga";
import type { Genre } from "@/types/genre";

export const FilterMangaCarousel = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<
    MangaSearchParams["status"] | "all"
  >("all");
  const [sortBy, setSortBy] = useState<MangaSearchParams["sortBy"]>("newest");

  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        const g = await genreService.getGenres();
        setGenres(g);
      } catch (err) {
        console.error("Failed to load genres:", err);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const params: MangaSearchParams = { page: 1, limit: 12 };
        // send sortBy value directly (API expects the same key from UI)
        if (sortBy) params.sortBy = sortBy as MangaSearchParams["sortBy"];

        if (selectedGenre && selectedGenre !== "all")
          params.genres = selectedGenre;
        if (selectedStatus && selectedStatus !== "all")
          params.status = selectedStatus as MangaSearchParams["status"];

        const res = await mangaService.searchMangas(params);
        if (res && res.mangas) setMangas(res.mangas);
      } catch (err) {
        console.error("Failed to fetch filtered mangas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedGenre, selectedStatus, sortBy]);

  const scrollBy = (delta: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        <h2 className="text-lg font-semibold text-foreground text-left">
          Lọc truyện
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="text-sm">Thể loại</Label>
            <Select
              value={selectedGenre}
              onValueChange={(v) => setSelectedGenre(v)}
            >
              <SelectTrigger id="filter-genre" className="w-full sm:w-48">
                <SelectValue
                  placeholder={loadingGenres ? "Đang tải..." : "Tất cả"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g._id} value={g._id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="text-sm">Trạng thái</Label>
            <Select
              value={selectedStatus}
              onValueChange={(v) =>
                setSelectedStatus(v as MangaSearchParams["status"] | "all")
              }
            >
              <SelectTrigger id="filter-status" className="w-full sm:w-40">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ongoing">Đang tiến hành</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="hiatus">Tạm ngưng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="text-sm">Sắp xếp</Label>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as MangaSearchParams["sortBy"])}
            >
              <SelectTrigger id="filter-sort" className="w-full sm:w-44">
                <SelectValue placeholder="Mới nhất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="updated">Cập nhật gần đây</SelectItem>
                <SelectItem value="mostViewed">Xem nhiều nhất</SelectItem>
                <SelectItem value="highestRating">Đánh giá cao</SelectItem>
                <SelectItem value="mostFollowed">Theo dõi nhiều</SelectItem>
                <SelectItem value="az">Tên A-Z</SelectItem>
                <SelectItem value="za">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          aria-label="prev"
          onClick={() => scrollBy(-400)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/60 p-2 shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-16"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 snap-start w-[200px] sm:w-[220px] md:w-[260px] h-[440px] space-y-2"
                >
                  <Skeleton className="h-64 w-full rounded" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            : mangas.map((m) => (
                <div
                  key={m._id}
                  className="flex-shrink-0 snap-start w-[200px] sm:w-[220px] md:w-[260px] h-[440px]"
                >
                  <div className="transform-gpu will-change-transform w-full h-full">
                    <MangaCard manga={m} size="sm" />
                  </div>
                </div>
              ))}
        </div>

        <button
          aria-label="next"
          onClick={() => scrollBy(400)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/60 p-2 shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
