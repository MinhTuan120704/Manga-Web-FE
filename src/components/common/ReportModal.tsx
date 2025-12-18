import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { reportService } from "@/services/report.service";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mangaId: string;
  mangaTitle: string;
}

export const ReportModal = ({
  isOpen,
  onClose,
  mangaId,
  mangaTitle,
}: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do báo cáo");
      return;
    }

    if (reason.trim().length < 10) {
      toast.error("Lý do báo cáo phải có ít nhất 10 ký tự");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmReport = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để báo cáo");
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport(mangaId, { reason: reason.trim() });
      toast.success("Gửi báo cáo thành công", {
        description: "Cảm ơn bạn đã góp phần cải thiện nội dung trên nền tảng",
      });
      setReason("");
      setShowConfirmModal(false);
      onClose();
    } catch (error: unknown) {
      console.error("Failed to submit report:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error("Gửi báo cáo thất bại", {
        description:
          err?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-popover rounded-lg p-6 w-full max-w-lg border border-border">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-popover-foreground">
                  Báo cáo vi phạm
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Báo cáo manga:{" "}
                  <span className="font-medium">{mangaTitle}</span>
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Vui lòng cung cấp thông tin chi tiết về vi phạm. Báo cáo của bạn
                sẽ được quản trị viên xem xét và xử lý.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-reason">
                Lý do báo cáo <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Nội dung vi phạm bản quyền, hình ảnh không phù hợp, spam, vi phạm quy định cộng đồng..."
                rows={6}
                className="resize-none"
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tối thiểu 10 ký tự</span>
                <span>{reason.length}/500</span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs text-destructive font-medium">
                ⚠️ Lưu ý quan trọng
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Báo cáo sai sự thật hoặc lạm dụng chức năng báo cáo có thể dẫn
                đến việc tài khoản của bạn bị khóa.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || !reason.trim()}
            >
              Gửi báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmReport}
        title="Xác nhận gửi báo cáo"
        message={`Bạn có chắc chắn muốn báo cáo manga "${mangaTitle}"? Báo cáo sẽ được gửi đến quản trị viên để xem xét.`}
        confirmText="Gửi báo cáo"
        cancelText="Hủy"
        variant="warning"
        loading={isSubmitting}
      />
    </>
  );
};
