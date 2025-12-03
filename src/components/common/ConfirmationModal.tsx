import { AlertTriangle,  CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "info",
  loading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertTriangle className="w-12 h-12 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case "info":
        return <CheckCircle className="w-12 h-12 text-primary" />;
    }
  };

  const getConfirmButtonVariant = () => {
    return variant === "danger" ? "destructive" : "default";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg p-4 sm:p-6 w-full max-w-md border border-border">
        <div className="flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center">{getIcon()}</div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-popover-foreground">
            {title}
          </h2>

          {/* Message */}
          <p className="text-sm sm:text-base text-muted-foreground">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 w-full mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={getConfirmButtonVariant()}
              onClick={onConfirm}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Đang xử lý..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
