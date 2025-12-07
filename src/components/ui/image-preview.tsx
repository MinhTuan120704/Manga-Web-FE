import { useState, useEffect } from "react";
import { X, ImageOff } from "lucide-react";
import { toast } from "sonner";

interface ImagePreviewProps {
  file: File;
  alt: string;
  className?: string;
  onRemove?: () => void;
}

const FALLBACK_IMAGE = "/placeholder-image.png";

export function ImagePreview({
  file,
  alt,
  className,
  onRemove,
}: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !(file instanceof File)) {
      setPreview(FALLBACK_IMAGE);
      setError("File không hợp lệ");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File tải lên không phải là ảnh");
      setPreview(FALLBACK_IMAGE);
      setError("Không phải file ảnh");
      return;
    }

    // Validate file size (max 10MB for security)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Kích thước ảnh vượt quá 10MB");
      setPreview(FALLBACK_IMAGE);
      setError("File quá lớn");
      return;
    }

    // Use FileReader to convert file to Data URL 
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string" && result.startsWith("data:image/")) {
        setPreview(result);
        setError(null);
      } else {
        toast.error("Không thể đọc file ảnh");
        setPreview(FALLBACK_IMAGE);
        setError("Đọc file thất bại");
      }
    };

    reader.onerror = () => {
      toast.error("Không thể tải ảnh lên");
      setPreview(FALLBACK_IMAGE);
      setError("Tải ảnh thất bại");
    };

    try {
      reader.readAsDataURL(file);
    } catch {
      toast.error("Không thể đọc file");
      setPreview(FALLBACK_IMAGE);
      setError("Đọc file thất bại");
    }

    return () => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  if (!preview) {
    return null;
  }

  return (
    <div className={className}>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <div className="text-center">
            <ImageOff className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : preview && preview.startsWith("data:image/") ? (
        <img
          src={preview}
          alt={alt}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            // Validate loaded image
            const img = e.currentTarget;
            if (!img.complete || img.naturalWidth === 0) {
              toast.error("Ảnh tải lên không hợp lệ");
              setError("Ảnh không hợp lệ");
            }
          }}
          onError={() => {
            toast.error("Không thể hiển thị ảnh");
            setError("Hiển thị ảnh thất bại");
            setPreview(FALLBACK_IMAGE);
          }}
        />
      ) : (
        <img
          src={FALLBACK_IMAGE}
          alt="Ảnh không hợp lệ"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition-colors"
          aria-label="Remove image"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
