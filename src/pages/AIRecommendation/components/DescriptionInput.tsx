import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface DescriptionInputProps {
  onSubmit: (description: string) => void;
  loading: boolean;
}

export const DescriptionInput = ({
  onSubmit,
  loading,
}: DescriptionInputProps) => {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = description.trim();

    // Validation
    if (!trimmed) {
      setError("Vui lòng nhập mô tả");
      return;
    }
    if (trimmed.length < 10) {
      setError("Mô tả phải có ít nhất 10 ký tự");
      return;
    }
    if (trimmed.length > 500) {
      setError("Mô tả không được vượt quá 500 ký tự");
      return;
    }

    onSubmit(trimmed);
  };

  const characterCount = description.length;
  const isValid =
    characterCount >= 10 &&
    characterCount <= 500 &&
    description.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold">
          Mô tả truyện bạn muốn tìm
        </Label>
        <Textarea
          id="description"
          placeholder="Ví dụ: Tôi muốn đọc truyện về ninja với sức mạnh siêu nhiên và có yếu tố tình cảm..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={6}
          className="resize-none text-base"
        />
        <div className="flex items-center justify-between text-sm">
          <span
            className={
              error
                ? "text-destructive"
                : characterCount < 10
                ? "text-muted-foreground"
                : characterCount > 500
                ? "text-destructive"
                : "text-muted-foreground"
            }
          >
            {error || `${characterCount}/500 ký tự`}
          </span>
          {characterCount >= 10 && characterCount <= 500 && (
            <span className="text-primary text-xs font-medium">
              ✓ Độ dài hợp lệ
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin animate-ping" />
            Đang tìm kiếm...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Tìm truyện với AI
          </>
        )}
      </Button>
    </form>
  );
};
