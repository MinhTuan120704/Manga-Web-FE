import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { mangaService } from "@/services/manga.service";
import { chapterService } from "@/services/chapter.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";
import type { Manga } from "@/types/manga";
import type { Chapter } from "@/types/chapter";
import { ChapterList } from "./components/ChapterList";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export function ChapterManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!id) return;

      const [mangaData, chaptersData] = await Promise.all([
        mangaService.getMangaById(id),
        mangaService.getChaptersByMangaId(id),
      ]);

      setManga(mangaData);
      setChapters(Array.isArray(chaptersData) ? chaptersData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải thông tin truyện và chương");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapterToDelete(chapterId);
    setShowDeleteModal(true);
  };

  const confirmDeleteChapter = async () => {
    if (!chapterToDelete) return;

    try {
      await chapterService.deleteChapter(chapterToDelete);
      toast.success("Xóa chương thành công");
      setShowDeleteModal(false);
      setChapterToDelete(null);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      toast.error("Xóa chương thất bại");
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    navigate(`/uploader/manga/${id}/chapter/${chapter._id}/edit`);
  };

  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader" },
        { label: "Quản lý truyện", href: "/uploader/mangas" },
        { label: manga?.title || "Chi tiết truyện" },
      ]}
    >
      <div className="space-y-6">
        {/* Header with Manga Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/uploader/mangas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : manga ? (
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{manga.title}</h1>
                <Badge>{manga.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {chapters.length} chương
                </span>
                <span>Tác giả: {manga.author}</span>
              </div>
            </div>
          ) : null}

          <Button
            onClick={() => navigate(`/uploader/manga/${id}/create-chapter`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm chương mới
          </Button>
        </div>

        {/* Chapter List */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ChapterList
            chapters={chapters}
            onEdit={handleEditChapter}
            onDelete={handleDeleteChapter}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setChapterToDelete(null);
        }}
        onConfirm={confirmDeleteChapter}
        title="Xác nhận xóa chương"
        message="Bạn có chắc chắn muốn xóa chương này không? Hành động này không thể hoàn tác."
        confirmText="Xóa chương"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </UploaderLayout>
  );
}
