import { Home, User, Settings, LogOut, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ConfirmationModal } from "./ConfirmationModal";
import { useState } from "react";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: User, label: "Trang cá nhân", path: "/user/profile" },
    { icon: Settings, label: "Cài đặt", path: "/user/settings" },
  ];

  const getRoleBadge = (role: string) => {
    const badges = {
      reader: {
        text: "Người đọc truyện / đọc truyện",
        variant: "default" as const,
      },
      uploader: {
        text: "Người đăng truyện / đăng truyện",
        variant: "default" as const,
      },
      admin: { text: "Quản trị viên", variant: "destructive" as const },
    };
    return badges[role as keyof typeof badges] || badges.reader;
  };

  const badge = getRoleBadge(user?.role || "reader");

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        bg-sidebar flex flex-col flex-shrink-0
        transition-all duration-300 ease-in-out overflow-hidden
        ${
          isOpen
            ? "w-[280px] border-r border-sidebar-border"
            : "w-0 border-r-0 invisible lg:invisible"
        }
      `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.username || "User"
                )}&background=random&size=64`}
              />
              <AvatarFallback>
                {user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center w-full">
              <h3 className="text-sidebar-foreground font-medium text-sm break-words px-2">
                {user?.username || "John Doe"}
              </h3>
              <Badge
                variant={badge.variant}
                className="mt-1 text-[10px] px-2 py-0.5 break-words max-w-full inline-block"
              >
                {badge.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 px-6 py-3 text-destructive hover:bg-sidebar-accent transition-colors border-t border-sidebar-border"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </aside>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        confirmText="Đăng xuất"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </>
  );
};
