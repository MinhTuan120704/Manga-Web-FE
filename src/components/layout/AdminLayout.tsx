import { lazy, Suspense, useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

const AdminSidebar = lazy(() => import("@/components/app-sidebar-admin"));
const LoadingSpinner = lazy(() => import("@/components/common/LoadingSpinner"));

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AdminLayout = ({
  children,
  breadcrumbs = [],
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Determine active tab from current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/manga")) return "manga";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/translations")) return "translations";
    if (path.includes("/admin/reports")) return "reports";
    if (path.includes("/admin/settings")) return "settings";
    return "overview";
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

  const user = authService.getStoredUser();

  return (
    <SidebarProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <AdminSidebar activeTab={getActiveTab()} />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink
                          onClick={() => navigate(crumb.href!)}
                          className="cursor-pointer"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <div className="flex-1" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.avatarUrl}
                    alt={user?.username || "Admin"}
                  />
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "admin@manga.com"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Vai trò: {user?.role || "admin"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutConfirm(true)}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>

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
    </SidebarProvider>
  );
};
