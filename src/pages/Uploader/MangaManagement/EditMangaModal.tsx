import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { mangaService } from "@/services/manga.service";
import { genreService } from "@/services/genre.service";
import { Loader2, Search, X } from "lucide-react";
import type { Manga } from "@/types/manga";
import type { Genre } from "@/types/genre";

interface EditMangaModalProps {
  manga: Manga | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMangaModal({
  manga,
  isOpen,
  onClose,
  onSuccess,
}: EditMangaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    artist: "",
    status: "ongoing" as "ongoing" | "completed" | "hiatus" | "cancelled",
  });

  // Genre states
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [genreSearch, setGenreSearch] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const genreInputRef = useRef<HTMLInputElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await genreService.getGenres();
        let genreList: Genre[] = [];

        if (Array.isArray(response)) {
          genreList = response;
        } else if (response && typeof response === "object") {
          const apiResponse = response as { data?: Genre[] };
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            genreList = apiResponse.data;
          }
        }

        setGenres(genreList);
      } catch (error) {
        console.error("Error loading genres:", error);
        setGenres([]);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node) &&
        genreInputRef.current &&
        !genreInputRef.current.contains(event.target as Node)
      ) {
        setShowGenreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (manga) {
      setFormData({
        title: manga.title || "",
        description: manga.description || "",
        author: manga.author || "",
        artist: manga.artist || "",
        status: manga.status || "ongoing",
      });

      // Set selected genres from manga
      // Handle both populated Genre objects and string IDs
      if (manga.genres && Array.isArray(manga.genres)) {
        const mappedGenres: Genre[] = manga.genres.map((g: any) => {
          // If it's already a Genre object with name
          if (typeof g === "object" && g._id && g.name) {
            return { _id: g._id, name: g.name } as Genre;
          }
          // If it's just a string ID, try to find in loaded genres
          if (typeof g === "string") {
            const found = genres.find((genre) => genre._id === g);
            return found || { _id: g, name: "Unknown" } as Genre;
          }
          // If it's an object with _id but no name (edge case)
          if (typeof g === "object" && g._id) {
            const found = genres.find((genre) => genre._id === g._id);
            return found || { _id: g._id, name: "Unknown" } as Genre;
          }
          return null;
        }).filter((g): g is Genre => g !== null);
        
        setSelectedGenres(mappedGenres);
      } else {
        setSelectedGenres([]);
      }
    }
  }, [manga, genres]);

  // Filter genres based on search
  const filteredGenres = Array.isArray(genres)
    ? genres.filter((genre) => {
        const matchesSearch =
          genreSearch.trim() === "" ||
          genre.name.toLowerCase().includes(genreSearch.toLowerCase());
        const notSelected = !selectedGenres.some(
          (selected) => selected._id === genre._id
        );
        return matchesSearch && notSelected;
      })
    : [];

  const handleGenreSelect = (genre: Genre) => {
    if (selectedGenres.length >= 5) {
      toast.error("Chỉ được chọn tối đa 5 thể loại");
      return;
    }
    setSelectedGenres((prev) => [...prev, genre]);
    setGenreSearch("");
    setShowGenreDropdown(false);
  };

  const handleGenreRemove = (genreId: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g._id !== genreId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manga) return;

    try {
      setLoading(true);
      await mangaService.updateManga(manga._id, {
        ...formData,
        genres: selectedGenres.map((g) => g._id),
      });
      toast.success("Cập nhật truyện thành công");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update manga:", error);
      toast.error("Cập nhật truyện thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ongoing: "Đang tiến hành",
      completed: "Hoàn thành",
      hiatus: "Tạm ngưng",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa truyện</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin truyện của bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên truyện */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên truyện <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tên truyện"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tác giả */}
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Nhập tên tác giả"
              />
            </div>

            {/* Họa sĩ */}
            <div className="space-y-2">
              <Label htmlFor="artist">Họa sĩ</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                placeholder="Nhập tên họa sĩ"
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">
                  {getStatusLabel("ongoing")}
                </SelectItem>
                <SelectItem value="completed">
                  {getStatusLabel("completed")}
                </SelectItem>
                <SelectItem value="hiatus">
                  {getStatusLabel("hiatus")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {getStatusLabel("cancelled")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thể loại */}
          <div className="space-y-2">
            <Label>Thể loại</Label>
            {loadingGenres ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Search Input */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={genreInputRef}
                      type="text"
                      placeholder="Tìm kiếm thể loại..."
                      value={genreSearch}
                      onChange={(e) => {
                        setGenreSearch(e.target.value);
                        setShowGenreDropdown(true);
                      }}
                      onFocus={() => setShowGenreDropdown(true)}
                      disabled={loading || selectedGenres.length >= 5}
                      className="pl-10"
                    />
                  </div>

                  {/* Dropdown */}
                  {showGenreDropdown && filteredGenres.length > 0 && (
                    <div
                      ref={genreDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredGenres.map((genre) => (
                        <button
                          key={genre._id}
                          type="button"
                          onClick={() => handleGenreSelect(genre)}
                          className="w-full px-4 py-2 text-left hover:bg-accent transition-colors text-sm"
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {showGenreDropdown &&
                    genreSearch.trim() !== "" &&
                    filteredGenres.length === 0 && (
                      <div
                        ref={genreDropdownRef}
                        className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-3 text-center text-sm text-muted-foreground"
                      >
                        Không tìm thấy thể loại "{genreSearch}"
                      </div>
                    )}
                </div>

                {/* Selected Genres */}
                {selectedGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedGenres.map((genre) => (
                      <Badge
                        key={genre._id}
                        variant="secondary"
                        className="pl-3 pr-1.5 py-1"
                      >
                        {genre.name}
                        <button
                          type="button"
                          onClick={() => handleGenreRemove(genre._id)}
                          disabled={loading}
                          className="ml-1.5 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {selectedGenres.length === 0
                    ? "Click để xem danh sách thể loại"
                    : selectedGenres.length >= 5
                    ? "Đã đạt giới hạn 5 thể loại"
                    : `Đã chọn ${selectedGenres.length}/5 thể loại`}
                </p>
              </>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả truyện"
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
