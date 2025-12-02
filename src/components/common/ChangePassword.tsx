import { useState } from "react";
import { X } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "./ConfirmationModal";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePassword = ({ isOpen, onClose }: ChangePasswordProps) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmChange = async () => {
    setLoading(true);
    try {
      await authService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      alert("Đổi mật khẩu thành công");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowConfirmation(false);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg p-4 sm:p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-popover-foreground">
            Đổi mật khẩu
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              placeholder="Mật khẩu cũ"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="Mật khẩu mới"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang lưu..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmChange}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu không? Bạn sẽ phải đăng nhập lại với mật khẩu mới."
        confirmText="Đổi mật khẩu"
        cancelText="Hủy bỏ"
        variant="warning"
        loading={loading}
      />
    </div>
  );
};
