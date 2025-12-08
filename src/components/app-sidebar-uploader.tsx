import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  // SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  FolderOpen,
  BarChart3,
  Settings,
  // ArrowLeftRight,
  // Home,
  MessageSquare
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppSidebarUploader() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/uploader",
      description: "Tổng quan",
    },
    {
      title: "Truyện của tôi",
      icon: FolderOpen,
      url: "/uploader/mangas",
      description: "Quản lý truyện",
    },
    {
        title: "Quản lý bình luận",
        icon: MessageSquare,
        url: "/uploader/comments",
        description: "Quản lý bình luận",
    }
  ];

  const quickActions = [
    {
      title: "Tạo truyện mới",
      icon: Plus,
      url: "/uploader/manga/create",
      variant: "default" as const,
    },
  ];

  const otherItems = [
    {
      title: "Thống kê",
      icon: BarChart3,
      url: "/uploader/analytics",
    },
    {
      title: "Cài đặt",
      icon: Settings,
      url: "/uploader/settings",
    },
  ];

  const isActive = (url: string) => location.pathname === url;

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">Uploader Mode</h2>
            <p className="text-xs text-muted-foreground">Quản lý nội dung</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Switch Mode Section */}
        {/* <SidebarGroup>
          <SidebarGroupContent>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Chuyển sang Reader Mode</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup> */}

        <Separator />

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.description}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Thao tác nhanh</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start gap-2"
                onClick={() => navigate(action.url)}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.title}</span>
              </Button>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Other Items */}
        <SidebarGroup>
          <SidebarGroupLabel>Khác</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {/* <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Button>
      </SidebarFooter> */}
    </Sidebar>
  );
}