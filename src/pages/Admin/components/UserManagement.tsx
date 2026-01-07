import { userService } from "@/services/user.service";
import type { UserListResponse } from "@/types/api";
import {
  Users,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserX,
  Edit2,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

function getRoleInVietnamese(role: string): string {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "uploader":
      return "Người đăng tải";
    case "reader":
      return "Người dùng";
    default:
      return role;
  }
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState<UserListResponse>({
    users: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof userList.users[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<typeof userList.users[0] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserList = useCallback(async (page: number = 1) => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsers({
        page: page,
        limit: 10,
        search: searchTerm,
        role:
          filterRole !== "All"
            ? (filterRole as "admin" | "uploader" | "reader")
            : undefined,
      });
      console.log(response);

      if (response) {
        setUserList(response);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [searchTerm, filterRole]);

  useEffect(() => {
    fetchUserList(1);
  }, [fetchUserList]);

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);
      await userService.adminUpdateUser({
        userId: selectedUser._id,
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
        avatarUrl: selectedUser.avatarUrl,
      });

      toast.success("Cập nhật người dùng thành công", {
        description: `Đã cập nhật thông tin của ${selectedUser.username}`,
      });

      setShowSaveConfirm(false);
      setIsModalOpen(false);
      fetchUserList(currentPage);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Cập nhật thất bại", {
        description:
          "Không thể cập nhật thông tin người dùng. Vui lòng thử lại.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      await userService.adminDeleteUser(userToDelete._id);

      toast.success("Xóa người dùng thành công", {
        description: `Đã xóa tài khoản ${userToDelete.username}`,
      });

      setShowDeleteConfirm(false);
      setUserToDelete(null);
      fetchUserList(currentPage);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Xóa thất bại", {
        description: "Không thể xóa người dùng. Vui lòng thử lại.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Quản lý người dùng
        </h2>
        <p className="text-muted-foreground">
          Giám sát và quản lý tài khoản người dùng và quyền hạn
        </p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Users</p>
            <p className="text-2xl font-bold text-card-foreground">12,345</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Users className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active This Month</p>
            <p className="text-2xl font-bold text-card-foreground">8,456</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Shield className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Moderators</p>
            <p className="text-2xl font-bold text-card-foreground">24</p>
          </div>
        </div>
      </div> */}

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
            placeholder="Tìm kiếm theo tên người dùng hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <Select
            value={filterRole}
            onValueChange={(v) => setFilterRole(v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Tất cả</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="uploader">Người đăng tải</SelectItem>
              <SelectItem value="reader">Người dùng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loadingUsers ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                {[
                  "Avatar",
                  "Người dùng",
                  "Email",
                  "Vai trò",
                  "Tham gia",
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
              {[...Array(5)].map((_, i) => (
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                  Avatar
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Tham gia
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b border-border hover:bg-accent/50 transition ${
                    index % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6 py-4 text-card-foreground font-medium">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.username}'s avatar`}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : user.role === "uploader"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {getRoleInVietnamese(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-accent transition text-card-foreground"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user);
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
      {!loadingUsers && userList.users.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * 10 + 1} đến{" "}
            {Math.min(currentPage * 10, userList.pagination.totalItems)} trong
            tổng số {userList.pagination.totalItems} người dùng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUserList(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: userList.pagination.totalPages },
                (_, i) => i + 1
              )
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === userList.pagination.totalPages ||
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
                        onClick={() => fetchUserList(page)}
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
              onClick={() => fetchUserList(currentPage + 1)}
              disabled={currentPage === userList.pagination.totalPages}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingUsers && userList.users.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <UserX className="mx-auto mb-4 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">
            Không tìm thấy người dùng nào phù hợp với tiêu chí của bạn
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Chi tiết người dùng
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Xem và cập nhật thông tin người dùng
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
                    Thông tin chi tiết về tài khoản người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                      {selectedUser.avatarUrl ? (
                        <img
                          src={selectedUser.avatarUrl}
                          alt={selectedUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users size={40} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avatar</p>
                      <p className="text-foreground font-medium">
                        {selectedUser.avatarUrl
                          ? "Đã có ảnh đại diện"
                          : "Chưa có ảnh đại diện"}
                      </p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="user-username">
                      Tên người dùng <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="user-username"
                      value={selectedUser.username}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          username: e.target.value,
                        })
                      }
                      placeholder="Nhập tên người dùng..."
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="user-email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                      placeholder="Nhập email..."
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Vai trò</Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: value as "reader" | "uploader" | "admin",
                        })
                      }
                    >
                      <SelectTrigger id="user-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reader">Người dùng</SelectItem>
                        <SelectItem value="uploader">Người đăng tải</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin tài khoản */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>
                    Trạng thái và thời gian hoạt động
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Ngày tham gia:
                      </span>
                      <p className="text-foreground font-medium">
                        {selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Cập nhật lần cuối:
                      </span>
                      <p className="text-foreground font-medium">
                        {selectedUser.updatedAt
                          ? new Date(selectedUser.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <p className="text-foreground font-mono text-xs">
                        {selectedUser._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <p>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Hoạt động
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hoạt động */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê hoạt động</CardTitle>
                  <CardDescription>
                    Tổng quan về hoạt động của người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Manga theo dõi
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedUser.followedMangas?.length || 0}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Lịch sử đọc
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedUser.readingHistory?.length || 0}
                      </p>
                    </div>
                    <div className="bg-accent/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Manga tải lên
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedUser.uploadedMangas?.length || 0}
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
        onConfirm={handleSaveUser}
        title="Xác nhận lưu thay đổi"
        message={`Bạn có chắc chắn muốn lưu các thay đổi cho người dùng ${selectedUser?.username}?`}
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
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa tài khoản ${userToDelete?.username}? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
