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
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { ConfirmationModal } from "./ConfirmationModal";
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
} from "../ui/sidebar";
import { Separator } from "../ui/separator";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation data for User/Reader role
const data = {
  navMain: [
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
    {
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
    },
  ],
};

export const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    try {
      authService.logout();
      toast.success("Đăng xuất thành công");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

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
          className="lg:hidden absolute top-4 right-4 p-1 hover:bg-sidebar-accent rounded-lg transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <Sidebar className="border-none w-full">
          <SidebarHeader>
            <Link
              to="/"
              className="block"
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent transition-colors rounded-md">
                <img
                  src="/mangaria_logo.png"
                  alt="Mangaria Logo"
                  className="h-10 w-10 object-contain"
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
            {data.navMain.map((item, index) => {
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
                                onClick={() =>
                                  window.innerWidth < 1024 && onClose()
                                }
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
                                onClick={() =>
                                  window.innerWidth < 1024 && onClose()
                                }
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

                  {index < data.navMain.length - 1 &&
                    !data.navMain[index + 1]?.isTopLevel && (
                      <Separator className="my-2" />
                    )}
                </React.Fragment>
              );
            })}
          </SidebarContent>

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

          <SidebarRail />
        </Sidebar>
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
