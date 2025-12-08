import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { mangaService } from "@/services/manga.service";
import { Loader2 } from "lucide-react";
import type { Manga } from "@/types/manga";

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

  useEffect(() => {
    if (manga) {
      setFormData({
        title: manga.title || "",
        description: manga.description || "",
        author: manga.author || "",
        artist: manga.artist || "",
        status: manga.status || "ongoing",
      });
    }
  }, [manga]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manga) return;

    try {
      setLoading(true);
      await mangaService.updateManga(manga._id, formData);
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
