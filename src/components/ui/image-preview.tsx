import { useState, useEffect } from "react";
import { X, ImageOff } from "lucide-react";

interface ImagePreviewProps {
  file: File;
  alt: string;
  className?: string;
  onRemove?: () => void;
}

function isSafeBlobUrl(url: string | null): url is string {
  if (!url) return false;
  return url.startsWith("blob:");
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
      setError("Invalid file");
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.warn("File is not an image:", file.type);
      setPreview(FALLBACK_IMAGE);
      setError("Not an image file");
      return;
    }

    // Validate file size (max 10MB for security)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.warn("File too large:", file.size);
      setPreview(FALLBACK_IMAGE);
      setError("File too large");
      return;
    }

    // Create blob URL with proper error handling
    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
      if (isSafeBlobUrl(objectUrl)) {
        setPreview(objectUrl);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to create object URL:", error);
      setPreview(FALLBACK_IMAGE);
      setError("Failed to load");
    }

    return () => {
      if (objectUrl && isSafeBlobUrl(objectUrl)) {
        URL.revokeObjectURL(objectUrl);
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
      ) : (
        <img
          src={preview}
          alt={alt}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          onError={(e) => {
            console.error("Image failed to load");
            setError("Load failed");
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
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
