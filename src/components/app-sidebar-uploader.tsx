import * as React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Upload,
  LayoutDashboard,
  FolderOpen,
  /* BarChart3, */
  Settings,
  MessageSquare,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";

// Navigation data for Uploader role
const data = {
  navMain: [
    {
      title: "Trang cá nhân",
      url: "/user/profile",
      icon: User,
      isTopLevel: true,
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
          url: "/uploader/dashboard",
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
        // {
        //   title: "Thống kê",
        //   url: "/uploader/analytics",
        //   icon: BarChart3,
        // },
      ],
    },
  ],
};

export function AppSidebarUploader({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) =>
    setOpenGroups((s) => ({ ...s, [key]: !s[key] }));
  const isActive = (url?: string) =>
    url
      ? location.pathname === url ||
        location.pathname.startsWith(url.split("?")[0])
      : false;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="block">
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
                            className={
                              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium text-base transition-colors ` +
                              (isActive(item.url)
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                            }
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

          const open =
            openGroups[item.title] ??
            item.items?.some((si) => isActive(si.url));

          return (
            <React.Fragment key={item.title}>
              <SidebarGroup>
                <div className="flex items-center justify-between px-2 mb-1">
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/60 px-1 py-1"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </button>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    aria-label="Toggle group"
                    className="p-1"
                  >
                    {open ? (
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-sidebar-foreground/60" />
                    )}
                  </button>
                </div>

                {open && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items?.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              to={subItem.url}
                              className={
                                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ` +
                                (isActive(subItem.url)
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                              }
                            >
                              <subItem.icon className="h-4 w-4" />
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
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
