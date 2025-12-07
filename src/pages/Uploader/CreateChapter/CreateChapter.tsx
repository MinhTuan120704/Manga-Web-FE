import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { chapterService } from "@/services/chapter.service";
import { mangaService } from "@/services/manga.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useEffect } from "react";
import type { Manga } from "@/types/manga";

import { ImagePreview } from "@/components/ui/image-preview";

export function CreateChapter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [chapterNumber, setChapterNumber] = useState<string>("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pages, setPages] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
        mangaService.getMangaById(id).then(setManga).catch(console.error);
    }
  }, [id]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Append new files to existing ones
      const newFiles = Array.from(e.target.files);
      setPages(prev => [...prev, ...newFiles]);
    }
  };

  const removePage = (index: number) => {
    setPages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    if (!chapterNumber || !title) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
    }

    if (pages.length === 0) {
        toast.error("Vui lòng tải lên ít nhất một trang truyện");
        return;
    }

    try {
      setLoading(true);
      await chapterService.createChapter(id, {
        chapterNumber: Number(chapterNumber),
        title,
        pages,
        thumbnail: thumbnail || undefined
      });
      
      toast.success("Tạo chương mới thành công");
      navigate(`/uploader/manga/${id}/chapters`);
    } catch (error) {
      console.error("Failed to create chapter:", error);
      toast.error("Tạo chương thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader" },
        { label: "Quản lý truyện", href: "/uploader/mangas" },
        { label: manga?.title || "Chi tiết truyện", href: `/uploader/manga/${id}/chapters` },
        { label: "Thêm chương mới" },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Thêm chương mới</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin chương</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="chapterNumber">Số chương <span className="text-red-500">*</span></Label>
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
                  <Label htmlFor="title">Tên chương <span className="text-red-500">*</span></Label>
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
                    {thumbnail && (
                        <div className="relative w-16 h-16 border rounded overflow-hidden flex-shrink-0">
                            <ImagePreview 
                                file={thumbnail} 
                                alt="Thumbnail preview" 
                                className="w-full h-full"
                                onRemove={() => setThumbnail(null)}
                            />
                        </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pages">N nội dung chương (Ảnh) <span className="text-red-500">*</span></Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                    <input 
                        type="file" 
                        id="pages" 
                        multiple 
                        accept="image/*"
                        onChange={handlePagesChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Kéo thả hoặc click để tải lên ảnh trang truyện (Có thể chọn nhiều ảnh)
                        </p>
                    </div>
                </div>

                {/* File list preview */}
                {pages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {pages.map((file, index) => (
                            <div key={index} className="relative group border rounded-lg p-2 flex flex-col items-center gap-2">
                                <div className="w-full h-32 bg-muted rounded overflow-hidden">
                                    <ImagePreview 
                                        file={file} 
                                        alt={`Page ${index + 1}`} 
                                        className="w-full h-full"
                                    />
                                </div>
                                <span className="text-xs truncate w-full text-center">{file.name}</span>
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removePage(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 rounded">
                                    {index + 1}
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
                    onClick={() => navigate(`/uploader/manga/${id}/chapters`)}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo chương mới"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </UploaderLayout>
  );
}
