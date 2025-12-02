import { useState, useEffect } from "react";
import { ChevronRight, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChangePassword } from "@/components/common/ChangePassword";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";

export const UserSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    <>
      <div className="min-h-full bg-background">
        {/* Settings Content */}
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground">
            Cài đặt
          </h2>

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

            {/* Change Password */}
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-accent transition-colors"
            >
              <span className="text-base sm:text-lg font-semibold text-foreground">
                Đổi mật khẩu
              </span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>

            <Separator />

            {/* Notifications */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  Bật thông báo
                </span>
                <Switch />
              </div>
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
    </>
  );
};
