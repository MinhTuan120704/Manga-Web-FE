import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Search, User, LogOut, Settings, BookOpen, LayoutDashboard, ArrowLeftRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

interface MainLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function MainLayout({ children, breadcrumbs = [] }: MainLayoutProps) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    _id: string;
    username: string;
    role: string;
    email?: string;
    avatarUrl?: string;
  } | null>(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isAuthenticated();
      const user = authService.getStoredUser();
      
      setIsLoggedIn(loggedIn);
      setCurrentUser(user);
    };

    checkAuth();

    // Lắng nghe sự kiện storage để cập nhật khi đăng nhập/đăng xuất từ tab khác
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
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
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  // Lấy chữ cái đầu của username cho avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Lấy màu role badge
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-500";
      case "uploader":
        return "text-blue-500";
      default:
        return "text-green-500";
    }
  };

  // Format role name
  const formatRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "uploader":
        return "Uploader";
      default:
        return "Người đọc";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-sm ml-4">
            <form onSubmit={handleSearch}>
              <div className="relative border-2 rounded-lg">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm truyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </form>
          </div>

          {/* Right side controls */}
          <div className="ml-auto flex items-center gap-2">
            {/* Switch to Uploader Mode - Chỉ hiện nếu user là uploader */}
            {isLoggedIn && currentUser?.role === "uploader" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/uploader")}
                className="gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden sm:inline">Uploader Mode</span>
              </Button>
            )}

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

            {/* User Avatar/Login */}
            {isLoggedIn && currentUser ? (
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
                      <p className="font-medium text-sm">{currentUser.username}</p>
                      {currentUser.email && (
                        <p className="text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                      )}
                      <p className={`text-xs font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                        {formatRole(currentUser.role)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </DropdownMenuItem>
                  
                  {currentUser.role === "uploader" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/uploader")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/uploader/mangas")}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Truyện của tôi</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate("/login")} 
                size="sm"
                className="h-8"
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="p-4">{children}</div>
          {/* <Footer /> */}
        </main>
      </SidebarInset>
    </div>
  );
}
