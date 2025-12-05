import { useState } from "react";
import { X, Link, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url: string;
}

export const ShareModal = ({
  isOpen,
  onClose,
  title,
  description,
  url,
}: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Đã sao chép liên kết!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Không thể sao chép liên kết");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        // Handle user cancellation (AbortError) separately
        if (error && typeof error === "object" && (error as any).name === "AbortError") {
          // User cancelled the share dialog; do not show an error toast
          return;
        }
        console.error("Failed to share:", error);
        toast.error("Không thể chia sẻ liên kết");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-popover rounded-lg w-full max-w-md border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-popover-foreground">
            Chia sẻ truyện
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground line-clamp-2">
              {title}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {description}
              </p>
            )}
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sao chép liên kết</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-muted rounded-lg px-3 py-2 flex items-center min-w-0">
                <Link className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                <span className="text-sm text-foreground truncate">{url}</span>
              </div>
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                className="shrink-0 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Đã sao chép
                  </>
                ) : (
                  "Sao chép"
                )}
              </Button>
            </div>
          </div>

          {/* Native Share (if available) */}
          {"share" in navigator && (
            <Button
              onClick={handleNativeShare}
              variant="secondary"
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ bằng ứng dụng khác
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
