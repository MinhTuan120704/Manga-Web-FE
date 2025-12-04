import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Heart,
  Search,
  /*  Users, */
  BookOpen,
  /*  Clock, */
  Library,
  Sparkles,
  /* Mail,
  Info, */
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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

// Navigation data with routes
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
        /* {
          title: "Cập nhật mới",
          url: "#",
          icon: Clock,
        }, */
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
        /* {
          title: "Cập nhật gần đây",
          url: "#",
          icon: Clock,
        }, */
        {
          title: "Tìm kiếm AI",
          url: "/ai-recommendation",
          icon: Sparkles,
        },
      ],
    },
    /* {
      title: "Đội ngũ",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Về chúng tôi",
          url: "#",
          icon: Info,
        },
        {
          title: "Liên hệ",
          url: "#",
          icon: Mail,
        },
      ],
    }, */
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="block">
          <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent transition-colors rounded-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Manga Web</span>
              <span className="truncate text-xs text-muted-foreground">
                Manga Reader Platform
              </span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {/* Map through navigation items */}
        {data.navMain.map((item, index) => {
          if (item.isTopLevel) {
            return (
              <React.Fragment key={item.title}>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        {/* Special Homepage Button */}
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
                {/* Separator sau Homepage */}
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
      <SidebarRail />
    </Sidebar>
  );
}
