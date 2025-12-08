import { useState } from "react";
import {
  Trash2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
  X,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

const reportsList = [
  {
    id: 1,
    reportedBy: "user_123",
    contentType: "Manga",
    contentTitle: "Jujutsu Kaisen",
    reason: "Inappropriate content",
    description: "Contains explicit material",
    status: "Pending",
    date: "2024-11-12",
    priority: "High",
  },
  {
    id: 2,
    reportedBy: "user_456",
    contentType: "Comment",
    contentTitle: "Chapter 200 Discussion",
    reason: "Spam/Harassment",
    description: "Repeated spam comments",
    status: "Resolved",
    date: "2024-11-10",
    priority: "Medium",
  },
  {
    id: 3,
    reportedBy: "user_789",
    contentType: "User",
    contentTitle: "translator_pro",
    reason: "Suspicious activity",
    description: "Multiple account violations",
    status: "In Review",
    date: "2024-11-11",
    priority: "High",
  },
  {
    id: 4,
    reportedBy: "user_012",
    contentType: "Translation",
    contentTitle: "Chainsaw Man Ch. 50",
    reason: "Poor quality",
    description: "Machine translation detected",
    status: "Pending",
    date: "2024-11-09",
    priority: "Low",
  },
  {
    id: 5,
    reportedBy: "user_345",
    contentType: "Manga",
    contentTitle: "Attack on Titan",
    reason: "Duplicate upload",
    description: "Already exists in database",
    status: "Resolved",
    date: "2024-11-08",
    priority: "Low",
  },
];

const getStatusIcon = (status: string) => {
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
};

const getStatusColor = (status: string) => {
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
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-600 dark:text-red-400";
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "Low":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-gray-600";
  }
};

const getPriorityInVietnamese = (priority: string): string => {
  switch (priority) {
    case "High":
      return "Cao";
    case "Medium":
      return "Trung bình";
    case "Low":
      return "Thấp";
    default:
      return priority;
  }
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [processingNotes, setProcessingNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filteredReports = reportsList.filter((report) => {
    const matchesSearch =
      report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
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
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const stats = {
    pending: reportsList.filter((r) => r.status === "Pending").length,
    inReview: reportsList.filter((r) => r.status === "In Review").length,
    resolved: reportsList.filter((r) => r.status === "Resolved").length,
    total: reportsList.length,
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to update report
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      console.log("Saving report:", selectedReport);
      console.log("Processing notes:", processingNotes);

      toast.success("Cập nhật báo cáo thành công", {
        description: `Báo cáo #${selectedReport.id} đã được cập nhật`,
      });

      setIsModalOpen(false);
      setShowConfirmModal(false);
      setProcessingNotes("");
    } catch (error) {
      toast.error("Cập nhật thất bại", {
        description: "Đã có lỗi xảy ra khi cập nhật báo cáo",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to delete report
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      console.log("Deleting report:", selectedReport);

      toast.success("Xóa báo cáo thành công", {
        description: `Báo cáo #${selectedReport.id} đã được xóa`,
      });

      setIsModalOpen(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error("Xóa thất bại", {
        description: "Đã có lỗi xảy ra khi xóa báo cáo",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Báo cáo & Kiểm duyệt
        </h2>
        <p className="text-muted-foreground">
          Xem xét và quản lý báo cáo người dùng, spam và vi phạm nội dung
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Tổng báo cáo</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Đang chờ</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.pending}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Đang xem xét</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.inReview}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Đã giải quyết</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.resolved}
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

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Tất cả</option>
            <option>Đang chờ</option>
            <option>Đang xem xét</option>
            <option>Đã giải quyết</option>
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
                Báo cáo bởi
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Lý do
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Ưu tiên
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Ngày
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((report, index) => (
              <tr
                key={report.id}
                className={`border-b border-border hover:bg-accent/50 transition ${
                  index % 2 === 0 ? "bg-card" : "bg-muted"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {report.contentType}
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {report.contentTitle}
                </td>
                <td className="px-6 py-4 text-card-foreground">
                  {report.reportedBy}
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {report.reason}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${getPriorityColor(
                    report.priority
                  )}`}
                >
                  {getPriorityInVietnamese(report.priority)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusInVietnamese(report.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {report.date}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-accent transition text-card-foreground"
                    title="Chỉnh sửa"
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
                  Xem và xử lý báo cáo vi phạm
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
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin báo cáo</CardTitle>
                  <CardDescription>
                    Chi tiết về nội dung được báo cáo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Loại nội dung */}
                    <div className="space-y-2">
                      <Label htmlFor="report-content-type">Loại nội dung</Label>
                      <Input
                        id="report-content-type"
                        value={selectedReport.contentType}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    {/* Tiêu đề nội dung */}
                    <div className="space-y-2">
                      <Label htmlFor="report-content-title">
                        Tiêu đề nội dung
                      </Label>
                      <Input
                        id="report-content-title"
                        value={selectedReport.contentTitle}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Người báo cáo */}
                    <div className="space-y-2">
                      <Label htmlFor="report-by">Người báo cáo</Label>
                      <Input
                        id="report-by"
                        value={selectedReport.reportedBy}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    {/* Ngày báo cáo */}
                    <div className="space-y-2">
                      <Label htmlFor="report-date">Ngày báo cáo</Label>
                      <Input
                        id="report-date"
                        value={selectedReport.date}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  {/* Lý do */}
                  <div className="space-y-2">
                    <Label htmlFor="report-reason">Lý do báo cáo</Label>
                    <Input
                      id="report-reason"
                      value={selectedReport.reason}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Mô tả */}
                  <div className="space-y-2">
                    <Label htmlFor="report-description">Mô tả chi tiết</Label>
                    <Textarea
                      id="report-description"
                      value={selectedReport.description}
                      disabled
                      className="bg-muted"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Xử lý báo cáo */}
              <Card>
                <CardHeader>
                  <CardTitle>Xử lý báo cáo</CardTitle>
                  <CardDescription>
                    Cập nhật trạng thái và ưu tiên xử lý
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Trạng thái */}
                    <div className="space-y-2">
                      <Label htmlFor="report-status">Trạng thái</Label>
                      <Select
                        value={selectedReport.status}
                        onValueChange={(value) =>
                          setSelectedReport({
                            ...selectedReport,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger id="report-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Đang chờ</SelectItem>
                          <SelectItem value="In Review">
                            Đang xem xét
                          </SelectItem>
                          <SelectItem value="Resolved">
                            Đã giải quyết
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ưu tiên */}
                    <div className="space-y-2">
                      <Label htmlFor="report-priority">Mức độ ưu tiên</Label>
                      <Select
                        value={selectedReport.priority}
                        onValueChange={(value) =>
                          setSelectedReport({
                            ...selectedReport,
                            priority: value,
                          })
                        }
                      >
                        <SelectTrigger id="report-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Thấp</SelectItem>
                          <SelectItem value="Medium">Trung bình</SelectItem>
                          <SelectItem value="High">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Ghi chú xử lý */}
                  <div className="space-y-2">
                    <Label htmlFor="report-notes">
                      Ghi chú xử lý (tùy chọn)
                    </Label>
                    <Textarea
                      id="report-notes"
                      value={processingNotes}
                      onChange={(e) => setProcessingNotes(e.target.value)}
                      placeholder="Nhập ghi chú về cách xử lý báo cáo này..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin trạng thái */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin trạng thái</CardTitle>
                  <CardDescription>
                    Trạng thái hiện tại của báo cáo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Trạng thái hiện tại
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedReport.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            selectedReport.status
                          )}`}
                        >
                          {getStatusInVietnamese(selectedReport.status)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Mức độ ưu tiên
                      </p>
                      <p
                        className={`text-lg font-bold ${getPriorityColor(
                          selectedReport.priority
                        )}`}
                      >
                        {getPriorityInVietnamese(selectedReport.priority)}
                      </p>
                    </div>
                  </div>
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
                        #{selectedReport.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <p className="text-foreground font-medium">
                        {selectedReport.date}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Loại nội dung:
                      </span>
                      <p className="text-foreground font-medium">
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {selectedReport.contentType}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Người báo cáo:
                      </span>
                      <p className="text-foreground font-medium">
                        {selectedReport.reportedBy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setProcessingNotes("");
                }}
              >
                Đóng
              </Button>
              <Button onClick={() => setShowConfirmModal(true)}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Save */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSave}
        title="Xác nhận lưu thay đổi"
        message={`Bạn có chắc chắn muốn cập nhật báo cáo #${
          selectedReport?.id
        }? Trạng thái sẽ được thay đổi thành "${getStatusInVietnamese(
          selectedReport?.status || ""
        )}".`}
        confirmText="Lưu thay đổi"
        cancelText="Hủy"
        variant="info"
        loading={isSaving}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa báo cáo"
        message={`Bạn có chắc chắn muốn xóa báo cáo #${selectedReport?.id}? Hành động này không thể hoàn tác.`}
        confirmText="Xóa báo cáo"
        cancelText="Hủy"
        variant="danger"
        loading={isSaving}
      />
    </div>
  );
}
