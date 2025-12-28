import { AppSidebarUploader } from "@/components/app-sidebar-uploader";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ArrowLeftRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { toast } from "sonner";

interface UploaderLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function UploaderLayout({
  children,
  breadcrumbs = [],
}: UploaderLayoutProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    username: string;
    role: string;
    email?: string;
    avatarUrl?: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getStoredUser();
      setCurrentUser(user);
    };
    checkAuth();

    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

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

  const handleLogout = () => {
    try {
      authService.logout();
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebarUploader />
        <SidebarInset className="flex-1 min-w-0 flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Breadcrumbs moved below header to avoid layout overflow */}

            {/* Right side controls */}
            <div className="ml-auto flex items-center gap-2">
              {/* Switch to Reader Mode Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden sm:inline">Reader Mode</span>
              </Button>

              {/* Dark mode toggle */}
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

              {/* User Avatar */}
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={currentUser.avatarUrl}
                          alt={currentUser.username}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(currentUser.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {currentUser.username}
                        </p>
                        {currentUser.email && (
                          <p className="text-xs text-muted-foreground">
                            {currentUser.email}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-blue-500">
                          Uploader
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("user/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Tài khoản</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/uploader/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setShowLogoutConfirm(true)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>

          <PageBreadcrumbs breadcrumbs={breadcrumbs} />

          <main className="flex-1 overflow-auto overflow-x-hidden">
            <div className="p-4 w-full max-w-full min-w-0">{children}</div>
          </main>
        </SidebarInset>
      </div>

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
    </SidebarProvider>
  );
}
