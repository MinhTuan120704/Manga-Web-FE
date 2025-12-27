import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  Library,
  Sparkles,
  Upload,
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Settings,
  MessageSquare,
  User,
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

// Navigation data for Uploader role
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
    },
  ],
};

export function AppSidebarUploader({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <span className="truncate font-semibold">Uploader Panel</span>
              <span className="truncate text-xs text-muted-foreground">
                Quản lý nội dung
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
                    to="/uploader/settings"
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

    </Sidebar>
  );
}
