import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { chapterService } from "@/services/chapter.service";
import { mangaService } from "@/services/manga.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import type { Manga } from "@/types/manga";
import type { Chapter, Page } from "@/types/chapter";
import { ImagePreview } from "@/components/ui/image-preview";

export function EditChapter() {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [chapterNumber, setChapterNumber] = useState<string>("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [newPages, setNewPages] = useState<File[]>([]);
  const [existingPages, setExistingPages] = useState<Page[]>([]);
  const [pagesToDelete, setPagesToDelete] = useState<number[]>([]);

  useEffect(() => {
    if (mangaId && chapterId) {
      fetchData();
    }
  }, [mangaId, chapterId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!mangaId || !chapterId) return;

      const [mangaData, chapterData] = await Promise.all([
        mangaService.getMangaById(mangaId),
        chapterService.getChapterById(chapterId),
      ]);

      setManga(mangaData);
      setChapter(chapterData);
      
      // Pre-populate form fields
      setChapterNumber(chapterData.chapterNumber.toString());
      setTitle(chapterData.title);
      setThumbnailPreview(chapterData.thumbnail || "");
      setExistingPages(chapterData.pages || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải thông tin chương");
      navigate(`/uploader/manga/${mangaId}/chapters`);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleNewPagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} không phải là file ảnh`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} vượt quá 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setNewPages((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeNewPage = (index: number) => {
    setNewPages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPage = (pageNumber: number) => {
    setExistingPages((prev) => prev.filter((page) => page.pageNumber !== pageNumber));
    setPagesToDelete((prev) => [...prev, pageNumber]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mangaId || !chapterId) return;

    if (!chapterNumber || !title) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (existingPages.length === 0 && newPages.length === 0) {
      toast.error("Chương phải có ít nhất một trang");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare update data
      const updateData: any = {
        chapterNumber: Number(chapterNumber),
        title,
      };

      // Handle thumbnail update
      if (thumbnail) {
        updateData.thumbnail = thumbnail;
      }

      // Handle pages: send info about deleted and new pages
      if (pagesToDelete.length > 0) {
        updateData.pagesToDelete = pagesToDelete;
      }

      if (newPages.length > 0) {
        updateData.newPages = newPages;
      }

      await chapterService.updateChapter(chapterId, updateData);

      toast.success("Cập nhật chương thành công");
      navigate(`/uploader/manga/${mangaId}/chapters`);
    } catch (error) {
      console.error("Failed to update chapter:", error);
      toast.error("Cập nhật chương thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <UploaderLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/uploader/dashboard" },
          { label: "Quản lý truyện", href: "/uploader/mangas" },
          { label: "Chi tiết truyện", href: `/uploader/manga/${mangaId}/chapters` },
          { label: "Chỉnh sửa chương" },
        ]}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </UploaderLayout>
    );
  }

  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader/dashboard" },
        { label: "Quản lý truyện", href: "/uploader/mangas" },
        {
          label: manga?.title || "Chi tiết truyện",
          href: `/uploader/manga/${mangaId}/chapters`,
        },
        { label: "Chỉnh sửa chương" },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/uploader/manga/${mangaId}/chapters`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            Chỉnh sửa chương {chapter?.chapterNumber}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin chương</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chapterNumber">
                    Số chương <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    placeholder="Ví dụ: 1"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Tên chương <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ví dụ: Mở đầu"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Chương (Tùy chọn)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="cursor-pointer"
                  />
                  {thumbnailPreview && (
                    <div className="relative w-16 h-16 border rounded overflow-hidden flex-shrink-0">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      {thumbnail && (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview(chapter?.thumbnail || "");
                          }}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Pages */}
              {existingPages.length > 0 && (
                <div className="space-y-2">
                  <Label>Trang hiện tại</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPages.map((page) => (
                      <div
                        key={page.pageNumber}
                        className="relative group border rounded-lg p-2 flex flex-col items-center gap-2"
                      >
                        <div className="w-full h-32 bg-muted rounded overflow-hidden">
                          <img
                            src={page.image}
                            alt={`Page ${page.pageNumber}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs truncate w-full text-center">
                          Trang {page.pageNumber}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExistingPage(page.pageNumber)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Pages Upload */}
              <div className="space-y-2">
                <Label htmlFor="newPages">
                  Thêm trang mới {existingPages.length === 0 && <span className="text-red-500">*</span>}
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                  <input
                    type="file"
                    id="newPages"
                    multiple
                    accept="image/*"
                    onChange={handleNewPagesChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc click để tải lên ảnh trang mới (Có thể chọn
                      nhiều ảnh)
                    </p>
                  </div>
                </div>

                {/* New Pages Preview */}
                {newPages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {newPages.map((file, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-lg p-2 flex flex-col items-center gap-2"
                      >
                        <div className="w-full h-32 bg-muted rounded overflow-hidden">
                          <ImagePreview
                            file={file}
                            alt={`New page ${index + 1}`}
                            className="w-full h-full"
                          />
                        </div>
                        <span className="text-xs truncate w-full text-center">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewPage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 rounded">
                          Mới
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/uploader/manga/${mangaId}/chapters`)}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Đang cập nhật..." : "Cập nhật chương"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </UploaderLayout>
  );
}
