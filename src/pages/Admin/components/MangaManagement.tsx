import { useEffect, useState } from "react";
import {
  Trash2,
  Edit2,
  Search,
  Image,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  X,
} from "lucide-react";
import { mangaService } from "@/services/manga.service";
import type { MangaListResponse } from "@/types/api";
import type { Genre } from "@/types/genre";
import type { Manga } from "@/types/manga";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

const statusClasses = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  hiatus:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function getStatusInVietnamese(status: string): string {
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "ongoing":
      return "Đang tiến hành";
    case "hiatus":
      return "Tạm ngưng";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

export default function MangaManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [mangaList, setMangaList] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });

  const [loadingManga, setLoadingManga] = useState(false);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mangaToDelete, setMangaToDelete] = useState<Manga | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMangaList = async (page: number = 1) => {
    try {
      setLoadingManga(true);
      const response = await mangaService.getMangas({
        page: page,
        limit: 10,
        search: searchTerm,
        status:
          filterStatus !== "All"
            ? (filterStatus as "completed" | "ongoing" | "hiatus" | "cancelled")
            : undefined,
      });
      console.log(response);
      if (response) {
        setMangaList(response);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching featured mangas:", error);
    } finally {
      setLoadingManga(false);
    }
  };

  useEffect(() => {
    fetchMangaList(1);
  }, []);

  useEffect(() => {
    fetchMangaList(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchMangaList(1);
  }, [filterStatus]);

  const handleSaveManga = async () => {
    if (!selectedManga) return;

    try {
      setIsSaving(true);
      await mangaService.updateManga(selectedManga._id, {
        title: selectedManga.title,
        author: selectedManga.author,
        artist: selectedManga.artist,
        status: selectedManga.status,
        description: selectedManga.description,
        genres: Array.isArray(selectedManga.genres)
          ? selectedManga.genres.map((g: string | Genre) =>
              typeof g === "string" ? g : g._id
            )
          : [],
      });

      toast.success("Cập nhật manga thành công", {
        description: `Đã cập nhật thông tin của ${selectedManga.title}`,
      });

      setShowSaveConfirm(false);
      setIsModalOpen(false);
      fetchMangaList(currentPage);
    } catch (error) {
      console.error("Error updating manga:", error);
      toast.error("Cập nhật thất bại", {
        description: "Không thể cập nhật thông tin manga. Vui lòng thử lại.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteManga = async () => {
    if (!mangaToDelete) return;

    try {
      setIsDeleting(true);
      await mangaService.deleteManga(mangaToDelete._id);

      toast.success("Xóa manga thành công", {
        description: `Đã xóa ${mangaToDelete.title}`,
      });

      setShowDeleteConfirm(false);
      setMangaToDelete(null);
      fetchMangaList(currentPage);
    } catch (error) {
      console.error("Error deleting manga:", error);
      toast.error("Xóa thất bại", {
        description: "Không thể xóa manga. Vui lòng thử lại.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Quản lý Manga
          </h2>
          <p className="text-muted-foreground">Quản lý tất cả các đầu truyện</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề hoặc người dùng ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="ongoing">Đang tiến hành</option>
            <option value="hiatus">Tạm ngưng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {loadingManga ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                {[
                  "",
                  "Tên",
                  "Tác giả",
                  "Chương",
                  "Trạng thái",
                  "Người theo dõi",
                  "Đánh giá",
                  "Lượt xem",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-semibold text-card-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(9)].map((_, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${
                    i % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-scroll">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-card-foreground w-1/12"></th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-1/4">
                  Tên
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Tác giả
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Chương
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-1/6">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Người theo dõi
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Lượt xem
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {mangaList.mangas.map((manga, index) => (
                <tr
                  key={manga._id}
                  className={`border-b border-border hover:bg-accent/50 transition h-fit ${
                    index % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6  py-4 text-center text-card-foreground font-medium">
                    {manga.coverImage ? (
                      <img
                        src={manga.coverImage}
                        alt={`${manga.title} cover`}
                        className="w-12 h-16 rounded"
                      />
                    ) : (
                      <Image className="w-12 h-16 bg-muted rounded"></Image>
                    )}
                  </td>
                  <td className="px-8 py-4 text-card-foreground font-medium">
                    {manga.title}
                  </td>
                  <td className="px-6 py-4 text-center text-card-foreground">
                    {manga.author}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-center">
                    {manga.chapterCount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusClasses[manga.status] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {getStatusInVietnamese(manga.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.followedCount}
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.averageRating}
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.viewCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedManga(manga);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-accent transition text-card-foreground"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setMangaToDelete(manga);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition text-destructive"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loadingManga && mangaList.mangas.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * 10 + 1} đến{" "}
            {Math.min(currentPage * 10, mangaList.pagination.totalItems)} trong
            tổng số {mangaList.pagination.totalItems} manga
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMangaList(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: mangaList.pagination.totalPages },
                (_, i) => i + 1
              )
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === mangaList.pagination.totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsisBefore && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <button
                        onClick={() => fetchMangaList(page)}
                        className={`px-3 py-2 rounded-lg border transition ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border bg-card text-card-foreground hover:bg-accent"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => fetchMangaList(currentPage + 1)}
              disabled={currentPage === mangaList.pagination.totalPages}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingManga && mangaList.mangas.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <BookOpen className="mx-auto mb-4 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">
            Không tìm thấy manga nào phù hợp với tiêu chí của bạn
          </p>
        </div>
      )}

      {/* Manga Edit Modal */}
      {isModalOpen && selectedManga && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Chỉnh sửa Manga
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Cập nhật thông tin manga
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin chi tiết về manga
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tên manga */}
                  <div className="space-y-2">
                    <Label htmlFor="manga-title">
                      Tên manga <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="manga-title"
                      value={selectedManga.title}
                      onChange={(e) =>
                        setSelectedManga({
                          ...selectedManga,
                          title: e.target.value,
                        })
                      }
                      placeholder="Nhập tên manga..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Tác giả */}
                    <div className="space-y-2">
                      <Label htmlFor="manga-author">Tác giả</Label>
                      <Input
                        id="manga-author"
                        value={selectedManga.author || ""}
                        onChange={(e) =>
                          setSelectedManga({
                            ...selectedManga,
                            author: e.target.value,
                          })
                        }
                        placeholder="Nhập tên tác giả..."
                      />
                    </div>

                    {/* Nghệ sĩ */}
                    <div className="space-y-2">
                      <Label htmlFor="manga-artist">Nghệ sĩ</Label>
                      <Input
                        id="manga-artist"
                        value={selectedManga.artist || ""}
                        onChange={(e) =>
                          setSelectedManga({
                            ...selectedManga,
                            artist: e.target.value,
                          })
                        }
                        placeholder="Nhập tên nghệ sĩ..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Trạng thái */}
                    <div className="space-y-2">
                      <Label htmlFor="manga-status">Trạng thái</Label>
                      <Select
                        value={selectedManga.status}
                        onValueChange={(value) =>
                          setSelectedManga({
                            ...selectedManga,
                            status: value as
                              | "ongoing"
                              | "completed"
                              | "hiatus"
                              | "cancelled",
                          })
                        }
                      >
                        <SelectTrigger id="manga-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongoing">
                            Đang tiến hành
                          </SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="hiatus">Tạm ngưng</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div className="space-y-2">
                    <Label htmlFor="manga-description">Mô tả</Label>
                    <Textarea
                      id="manga-description"
                      value={selectedManga.description || ""}
                      onChange={(e) =>
                        setSelectedManga({
                          ...selectedManga,
                          description: e.target.value,
                        })
                      }
                      placeholder="Nhập mô tả manga..."
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ảnh bìa */}
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh bìa</CardTitle>
                  <CardDescription>Ảnh bìa hiện tại của manga</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedManga.coverImage ? (
                    <div className="w-48 h-64 border-2 border-border rounded-lg overflow-hidden">
                      <img
                        src={selectedManga.coverImage}
                        alt={selectedManga.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-64 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <div className="text-center">
                        <Image
                          size={48}
                          className="mx-auto text-muted-foreground mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          Không có ảnh bìa
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Thể loại */}
              <Card>
                <CardHeader>
                  <CardTitle>Thể loại</CardTitle>
                  <CardDescription>Các thể loại của manga</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedManga.genres?.map((genre: string | Genre) => (
                      <div
                        key={typeof genre === "string" ? genre : genre._id}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {typeof genre === "string" ? genre : genre.name}
                      </div>
                    ))}
                    {(!selectedManga.genres ||
                      selectedManga.genres.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        Không có thể loại nào
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Thống kê */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê</CardTitle>
                  <CardDescription>
                    Thông tin thống kê của manga
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Chương
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedManga.chapterCount || 0}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Người theo dõi
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedManga.followedCount || 0}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Đánh giá
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedManga.averageRating?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Lượt xem
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedManga.viewCount?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin khác */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khác</CardTitle>
                  <CardDescription>
                    Thông tin hệ thống và metadata
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Người tải lên:
                      </span>
                      <p className="text-foreground font-medium">
                        {typeof selectedManga.uploaderId === "object" &&
                        selectedManga.uploaderId
                          ? selectedManga.uploaderId.username
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <p className="text-foreground font-medium">
                        {selectedManga.createdAt
                          ? new Date(
                              selectedManga.createdAt
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Cập nhật lần cuối:
                      </span>
                      <p className="text-foreground font-medium">
                        {selectedManga.updatedAt
                          ? new Date(
                              selectedManga.updatedAt
                            ).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <p className="text-foreground font-mono text-xs">
                        {selectedManga._id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowSaveConfirm(true)}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveManga}
        title="Xác nhận lưu thay đổi"
        message={`Bạn có chắc chắn muốn lưu các thay đổi cho manga ${selectedManga?.title}?`}
        confirmText="Lưu"
        cancelText="Hủy"
        variant="info"
        loading={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setMangaToDelete(null);
        }}
        onConfirm={handleDeleteManga}
        title="Xác nhận xóa manga"
        message={`Bạn có chắc chắn muốn xóa manga ${mangaToDelete?.title}? Hành động này không thể hoàn tác và sẽ xóa tất cả các chương liên quan.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
