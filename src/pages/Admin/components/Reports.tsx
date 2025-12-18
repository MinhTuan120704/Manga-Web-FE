import { useState, useEffect } from "react";
import {
  Trash2,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
  X,
  RefreshCw,
} from "lucide-react";
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
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { PageLoader } from "@/components/common/PageLoader";
import { reportService } from "@/services/report.service";
import { mangaService } from "@/services/manga.service";
import { userService } from "@/services/user.service";
import type { Report } from "@/types/comment";
import type { User } from "@/types/user";
import type { Manga } from "@/types/manga";
import { toast } from "sonner";

/* const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="text-green-600" size={18} />;
    case "In Review":
      return <Clock className="text-yellow-600" size={18} />;
    case "Pending":
      return <AlertCircle className="text-red-600" size={18} />;
    default:
      return <AlertCircle size={18} />;
  }
}; */

/* const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "In Review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Pending":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusInVietnamese = (status: string): string => {
  switch (status) {
    case "Resolved":
      return "Đã giải quyết";
    case "In Review":
      return "Đang xem xét";
    case "Pending":
      return "Đang chờ";
    default:
      return status;
  }
}; */

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTime, setFilterTime] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingManga, setLoadingManga] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAllReports();
      setReports(response || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const isWithinTimeRange = (dateString: string, range: string): boolean => {
    const reportDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - reportDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (range) {
      case "today":
        return diffDays < 1;
      case "week":
        return diffDays < 7;
      case "month":
        return diffDays < 30;
      case "all":
      default:
        return true;
    }
  };

  const filteredReports = reports.filter((report) => {
    const userName =
      typeof report.userId === "object" && report.userId
        ? report.userId.username
        : "";
    const mangaTitle = typeof report.mangaId === "object" ? "Manga Title" : "";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mangaTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTime = isWithinTimeRange(report.createdAt, filterTime);

    return matchesSearch && matchesTime;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterTime(value);
    setCurrentPage(1);
  };

  // Calculate time-based stats
  const stats = {
    today: reports.filter((r) => isWithinTimeRange(r.createdAt, "today"))
      .length,
    week: reports.filter((r) => isWithinTimeRange(r.createdAt, "week")).length,
    month: reports.filter((r) => isWithinTimeRange(r.createdAt, "month"))
      .length,
    total: reports.length,
  };

  const handleDelete = async () => {
    if (!selectedReport) return;

    setIsSaving(true);
    try {
      await reportService.deleteReport(selectedReport._id);

      toast.success("Xóa báo cáo thành công", {
        description: `Báo cáo đã được xóa`,
      });

      setIsModalOpen(false);
      setShowDeleteConfirm(false);
      fetchReports();
    } catch (error) {
      toast.error("Xóa thất bại", {
        description: "Đã có lỗi xảy ra khi xóa báo cáo",
      });
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

 /*  const getUserName = (userId: string | User): string => {
    if (typeof userId === "object" && userId) {
      return userId.username;
    }
    return "Unknown User";
  };
 */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const fetchMangaDetails = async (mangaId: string) => {
    try {
      setLoadingManga(true);
      const manga = await mangaService.getMangaById(mangaId);
      setSelectedManga(manga);
    } catch (error) {
      console.error("Failed to fetch manga details:", error);
      toast.error("Không thể tải thông tin manga");
      setSelectedManga(null);
    } finally {
      setLoadingManga(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingUser(true);
      const user = await userService.adminGetUser(userId);
      setSelectedUser(user);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setSelectedUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    if (typeof report.mangaId === "string") {
      fetchMangaDetails(report.mangaId);
    }
    if (typeof report.userId === "string") {
      fetchUserDetails(report.userId);
    }
  };

 /*  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
    setSelectedManga(null);
    setSelectedUser(null);
  }; */

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Báo cáo & Kiểm duyệt
          </h2>
          <p className="text-muted-foreground">
            Xem xét và quản lý báo cáo người dùng, spam và vi phạm nội dung
          </p>
        </div>
        <Button onClick={fetchReports} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Tổng báo cáo</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Hôm nay</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.today}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">7 ngày qua</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.week}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">30 ngày qua</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.month}
          </p>
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
            placeholder="Tìm kiếm theo tiêu đề, người dùng hoặc lý do..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <select
            value={filterTime}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Loại nội dung
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Tiêu đề nội dung
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Lý do
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Ngày báo cáo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((report, index) => (
              <tr
                key={report._id}
                className={`border-b border-border hover:bg-accent/50 transition ${
                  index % 2 === 0 ? "bg-card" : "bg-muted"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Manga
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {typeof report.mangaId === "string"
                    ? report.mangaId
                    : "Manga"}
                </td>
                <td
                  className="px-6 py-4 text-card-foreground text-sm max-w-xs truncate"
                  title={report.reason}
                >
                  {report.reason}
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {formatDate(report.createdAt)}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleOpenModal(report)}
                    className="p-2 rounded-lg hover:bg-accent transition text-card-foreground"
                    title="Xem chi tiết"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition text-destructive"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReports.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1} đến{" "}
            {Math.min(endIndex, filteredReports.length)} trong tổng số{" "}
            {filteredReports.length} báo cáo
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsisBefore && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <AlertCircle
            className="mx-auto mb-4 text-muted-foreground"
            size={40}
          />
          <p className="text-muted-foreground">
            Không tìm thấy báo cáo nào phù hợp với tiêu chí của bạn
          </p>
        </div>
      )}

      {/* Report Detail Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Chi tiết báo cáo
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Xem thông tin báo cáo vi phạm
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
              {/* Thông tin báo cáo */}
              {/* Thông tin Manga */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin Manga bị báo cáo</CardTitle>
                  <CardDescription>
                    Chi tiết về manga được báo cáo vi phạm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingManga ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : selectedManga ? (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <img
                          src={selectedManga.coverImage}
                          alt={selectedManga.title}
                          className="w-24 h-32 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-manga.png';
                          }}
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <Label>Tiêu đề</Label>
                            <p className="text-foreground font-semibold text-lg">
                              {selectedManga.title}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Tác giả</Label>
                              <p className="text-foreground">{selectedManga.author}</p>
                            </div>
                            <div>
                              <Label>Trạng thái</Label>
                              <p className="text-foreground capitalize">{selectedManga.status}</p>
                            </div>
                          </div>
                          <div>
                            <Label>Lượt xem</Label>
                            <p className="text-foreground">{selectedManga.viewCount?.toLocaleString() || 0}</p>
                          </div>
                        </div>
                      </div>
                      {selectedManga.description && (
                        <div>
                          <Label>Mô tả</Label>
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {selectedManga.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Không thể tải thông tin manga
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin báo cáo</CardTitle>
                  <CardDescription>
                    Chi tiết về người báo cáo và lý do
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="report-date">Ngày báo cáo</Label>
                    <Input
                      id="report-date"
                      value={formatDate(selectedReport.createdAt)}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Lý do */}
                  <div className="space-y-2">
                    <Label htmlFor="report-reason">Lý do báo cáo</Label>
                    <Textarea
                      id="report-reason"
                      value={selectedReport.reason}
                      disabled
                      className="bg-muted"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin người báo cáo */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin người báo cáo</CardTitle>
                  <CardDescription>
                    Chi tiết về người dùng đã gửi báo cáo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingUser ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : selectedUser ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tên người dùng</Label>
                          <p className="text-foreground font-medium">{selectedUser.username}</p>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <p className="text-foreground">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Vai trò</Label>
                          <p className="text-foreground capitalize">{selectedUser.role}</p>
                        </div>
                        <div>
                          <Label>ID người dùng</Label>
                          <p className="text-foreground font-mono text-xs">{selectedUser._id}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Không thể tải thông tin người dùng
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Thông tin bổ sung */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin bổ sung</CardTitle>
                  <CardDescription>
                    Metadata và thông tin hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID báo cáo:</span>
                      <p className="text-foreground font-mono text-xs">
                        {selectedReport._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Ngày cập nhật:
                      </span>
                      <p className="text-foreground font-medium">
                        {formatDate(selectedReport.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Loại nội dung:
                      </span>
                      <p className="text-foreground font-medium">
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          Manga
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa báo cáo"
        message={`Bạn có chắc chắn muốn xóa báo cáo này? Hành động này không thể hoàn tác.`}
        confirmText="Xóa báo cáo"
        cancelText="Hủy"
        variant="danger"
        loading={isSaving}
      />
    </div>
  );
}
