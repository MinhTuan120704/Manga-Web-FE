import { useState, useEffect } from "react";
import { ChevronRight, Moon, Bell, Shield, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChangePassword } from "@/components/common/ChangePassword";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarUploader } from "@/components/app-sidebar-uploader";

export const UploaderSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    newComments: true,
    newFollowers: true,
    systemUpdates: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <AppSidebarUploader />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Cài đặt</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-card rounded-lg border border-border">
              {/* Interface Settings */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground">
                  Giao diện
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <span className="text-sm sm:text-base text-foreground">
                      Chế độ tối
                    </span>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                </div>
              </div>

              <Separator />

              {/* Notification Settings */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  Thông báo
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-foreground">
                      Bình luận mới
                    </span>
                    <Switch
                      checked={notifications.newComments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newComments: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-foreground">
                      Người theo dõi mới
                    </span>
                    <Switch
                      checked={notifications.newFollowers}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newFollowers: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-foreground">
                      Cập nhật hệ thống
                    </span>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, systemUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Uploader Preferences */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  Tùy chọn đăng tải
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base text-foreground">
                        Tự động lưu nháp
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Lưu tiến độ khi tạo truyện mới
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base text-foreground">
                        Nén ảnh tự động
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Tối ưu kích thước ảnh khi tải lên
                      </span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  Bảo mật
                </h3>
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full p-3 flex items-center justify-between hover:bg-accent transition-colors rounded-md"
                >
                  <span className="text-sm sm:text-base text-foreground">
                    Đổi mật khẩu
                  </span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </button>
              </div>

              <Separator />

              {/* Logout */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full p-4 sm:p-6 text-left text-destructive hover:bg-accent transition-colors rounded-b-lg"
              >
                <span className="text-base sm:text-lg font-semibold">
                  Đăng xuất
                </span>
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

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
};
