import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  Library,
  Sparkles,
  BarChart3,
  Users,
  Clock,
  FileText,
  Settings,
  User,
  Shield,
} from "lucide-react";
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

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
}

// Navigation data for Admin role
const data = {
  navMain: [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
      isTopLevel: true,
    },
    {
      title: "Người dùng",
      url: "#",
      icon: User,
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
        {
          title: "Trang cá nhân",
          url: "/user/profile",
          icon: User,
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
        {
          title: "Thống kê",
          url: "/admin/statistics",
          icon: BarChart3,
        },
      ],
    },
  ],
};

export default function AdminSidebar({ ...props }: AdminSidebarProps) {
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
              <span className="truncate font-semibold">Admin Panel</span>
              <span className="truncate text-xs text-muted-foreground">
                Bảng điều khiển
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
                <SidebarMenuButton asChild>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />

      {/* Confirmation modal removed from sidebar; logout handled in header */}
    </Sidebar>
  );
}
