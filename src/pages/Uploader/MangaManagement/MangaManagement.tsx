import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { mangaService } from "@/services/manga.service";
import { EditMangaModal } from "./EditMangaModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Book,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Manga } from "@/types/manga";

export function MangaManagement() {
  const navigate = useNavigate();
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingManga, setEditingManga] = useState<Manga | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchMangas();
  }, [page, search, statusFilter]);

  const fetchMangas = async () => {
    try {
      setLoading(true);
      const response = await mangaService.getMangas({
        page,
        limit: 10,
        search: search,
        // status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (response && response.mangas) {
        setMangas(response.mangas);
        setTotalPages(response.pagination.totalPages || 1);
      } else {
        setMangas([]);
      }
    } catch (error) {
      console.error("Failed to fetch mangas:", error);
      toast.error("Không thể tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mangaId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa truyện này không?")) {
      try {
        await mangaService.deleteManga(mangaId);
        toast.success("Xóa truyện thành công");
        fetchMangas();
      } catch (error) {
        console.error("Failed to delete manga:", error);
        toast.error("Xóa truyện thất bại");
      }
    }
  };

  const handleEdit = (manga: Manga) => {
    setEditingManga(manga);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchMangas();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      ongoing: "default",
      completed: "secondary",
      hiatus: "outline",
    };
    return variants[status] || "default";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ongoing: "Đang tiến hành",
      completed: "Hoàn thành",
      hiatus: "Tạm ngưng",
    };
    return labels[status] || status;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Client-side filtering if backend doesn't support it fully yet
  const filteredMangas = mangas.filter((manga) => {
    if (statusFilter !== "all" && manga.status !== statusFilter) return false;
    return true;
  });

  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader" },
        { label: "Quản lý truyện" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý truyện
            </h1>
            <p className="text-muted-foreground">
              Quản lý tất cả truyện bạn đã đăng tải
            </p>
          </div>
          <Button onClick={() => navigate("/uploader/manga/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm truyện mới
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên truyện..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1); // Reset page on filter
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ongoing">Đang tiến hành</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="hiatus">Tạm ngưng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-3">Truyện</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thống kê</th>
                  <th className="px-4 py-3">Cập nhật</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredMangas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      Không tìm thấy truyện nào
                    </td>
                  </tr>
                ) : (
                  filteredMangas.map((manga) => (
                    <tr key={manga._id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={manga.coverImage}
                            alt={manga.title}
                            className="w-10 h-14 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-manga.png";
                            }}
                          />
                          <div>
                            <p className="font-medium line-clamp-1">
                              {manga.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {manga.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusBadge(manga.status)}>
                          {getStatusLabel(manga.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {manga.viewCount?.toLocaleString() || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Book className="h-3 w-3" />
                            {manga.chapterCount || 0} chương
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(manga.updatedAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/uploader/manga/${manga._id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(manga)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(manga._id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa truyện
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <EditMangaModal
        manga={editingManga}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </UploaderLayout>
  );
}
