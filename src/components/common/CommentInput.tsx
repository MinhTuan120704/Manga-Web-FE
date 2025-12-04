import { useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentInputProps {
  username?: string;
  placeholder?: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function CommentInput({
  username = "User",
  placeholder = "Viết bình luận...",
  onSubmit,
  isSubmitting = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-card rounded-lg border border-border">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            username
          )}&background=random&size=40`}
        />
        <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col gap-2">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
          className="min-h-[80px] resize-none"
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Nhấn Ctrl+Enter để gửi
          </span>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Đang gửi..." : "Gửi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
