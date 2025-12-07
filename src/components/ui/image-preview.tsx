import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImagePreviewProps {
  file: File;
  alt: string;
  className?: string;
  onRemove?: () => void;
}

export function ImagePreview({ file, alt, className, onRemove }: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !(file instanceof File)) {
      setPreview(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.warn('File is not an image:', file.type);
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!preview) return null;

  return (
    <div className={className}>
      <img 
        src={preview}
        alt={alt}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
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
