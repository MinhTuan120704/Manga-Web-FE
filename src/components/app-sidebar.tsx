import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  Search,
  BookOpen,
  Library,
  Sparkles,
  User,
  Settings,
  Shield,
  BarChart3,
  Users,
  Clock,
  FileText,
  Upload,
  LayoutDashboard,
  FolderOpen,
  Plus,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Base navigation - available to all users
const baseNavigation = [
  {
    title: "Trang chủ",
    url: "/",
    icon: Home,
    isTopLevel: true,
  },
  {
    title: "Theo dõi",
    url: "#",
    icon: Heart,
    items: [
      {
        title: "Truyện đang theo dõi",
        url: "/user/profile?tab=favorites",
        icon: Library,
      },
      {
        title: "Lịch sử đọc",
        url: "/user/profile?tab=history",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Truyện",
    url: "#",
    icon: Search,
    items: [
      {
        title: "Tìm kiếm nâng cao",
        url: "/search",
        icon: Search,
      },
      {
        title: "Tìm kiếm AI",
        url: "/ai-recommendation",
        icon: Sparkles,
      },
    ],
  },
];

// User-specific navigation
const userNavigation = {
  title: "Cá nhân",
  url: "#",
  icon: User,
  items: [
    {
      title: "Trang cá nhân",
      url: "/user/profile",
      icon: User,
    },
    {
      title: "Cài đặt",
      url: "/user/settings",
      icon: Settings,
    },
  ],
};

// Uploader-specific navigation
const uploaderNavigation = {
  title: "Uploader",
  url: "#",
  icon: Upload,
  items: [
    {
      title: "Dashboard",
      url: "/uploader",
      icon: LayoutDashboard,
    },
    {
      title: "Truyện của tôi",
      url: "/uploader/mangas",
      icon: FolderOpen,
    },
    {
      title: "Tạo truyện mới",
      url: "/uploader/manga/create",
      icon: Plus,
    },
    {
      title: "Quản lý bình luận",
      url: "/uploader/comments",
      icon: MessageSquare,
    },
    {
      title: "Thống kê",
      url: "/uploader/analytics",
      icon: BarChart3,
    },
  ],
};

// Admin-specific navigation
const adminNavigation = {
  title: "Quản trị",
  url: "#",
  icon: Shield,
  items: [
    {
      title: "Tổng quan",
      url: "/admin/overview",
      icon: BarChart3,
    },
    {
      title: "Quản lý Manga",
      url: "/admin/manga",
      icon: BookOpen,
    },
    {
      title: "Người dùng",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Dịch thuật",
      url: "/admin/translations",
      icon: Clock,
    },
    {
      title: "Báo cáo",
      url: "/admin/reports",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, setCurrentUser] = useState(authService.getStoredUser());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [navData, setNavData] = useState(baseNavigation);

  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getStoredUser();
      setCurrentUser(user);

      // Build navigation based on user role
      const navigation = [...baseNavigation];

      if (user) {
        // Add user navigation for logged-in users
        navigation.push(userNavigation);

        // Add role-specific navigation
        if (user.role === "admin") {
          navigation.push(adminNavigation);
        } else if (user.role === "uploader") {
          navigation.push(uploaderNavigation);
        }
      }

      setNavData(navigation);
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Đăng xuất thành công");
      setCurrentUser(null);
      setNavData(baseNavigation);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="block">
          <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent transition-colors rounded-md">
            <img
              src="/mangaria_logo.svg"
              alt="Mangaria Logo"
              className="h-8 w-8 object-contain"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Mangaria</span>
              <span className="truncate text-xs text-muted-foreground">
                Manga Reader Platform
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {navData.map((item, index) => {
          if (item.isTopLevel) {
            return (
              <React.Fragment key={item.title}>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium text-base text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <Separator className="my-2" />
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={item.title}>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2 px-2 mb-1 text-xs font-medium text-sidebar-foreground/60">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={subItem.url}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span className="text-sm">{subItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {index < navData.length - 1 &&
                !navData[index + 1]?.isTopLevel && (
                  <Separator className="my-2" />
                )}
            </React.Fragment>
          );
        })}
      </SidebarContent>

      {currentUser && (
        <SidebarFooter className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      )}

      <SidebarRail />

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
    </Sidebar>
  );
}
