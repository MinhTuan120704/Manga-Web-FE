import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Users,
  Clock,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab: string;
}

export default function AdminSidebar({
  activeTab,
  ...props
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const menuItems = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: BarChart3,
      path: "/admin/overview",
    },
    {
      id: "manga",
      label: "Quản lý Manga",
      icon: BookOpen,
      path: "/admin/manga",
    },
    {
      id: "users",
      label: "Người dùng",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "translations",
      label: "Dịch thuật",
      icon: Clock,
      path: "/admin/translations",
    },
    { id: "reports", label: "Báo cáo", icon: FileText, path: "/admin/reports" },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">
                Quản trị Manga
              </h1>
              <p className="text-xs text-muted-foreground">Bảng điều khiển</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="transition-all duration-300"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={isActive}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/admin/settings")}
                  isActive={activeTab === "settings"}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1"
                >
                  <Settings size={20} />
                  <span>Cài đặt</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không?"
        confirmText="Đăng xuất"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </Sidebar>
  );
}
