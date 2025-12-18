import { useState } from "react";
import { ThumbsUp, Trash2, Edit2, MoreVertical, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";
import type { Comment } from "@/types/comment";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
}

export function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onLike,
}: CommentItemProps) {
  const [likes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  };

  const getUsername = (user: string | User): string => {
    if (typeof user === "string") return "Người dùng";
    if (!user) return "Người dùng";
    return user.username || "Người dùng";
  };

  const getUserId = (user: string | User): string | null => {
    if (typeof user === "string") return user;
    if (!user) return null;
    return user._id;
  };

  const isOwner = currentUserId && comment.user && getUserId(comment.user) === currentUserId;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    onEdit?.(comment._id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-0">
      {/* Avatar */}
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            getUsername(comment.user)
          )}&background=random&size=40`}
        />
        <AvatarFallback>
          {getUsername(comment.user).charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <span className="font-semibold text-foreground text-sm">
              {getUsername(comment.user)}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              {getTimeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Actions Menu */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mt-1 -mr-2"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(comment._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comment Text or Edit Mode */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Lưu
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-1" />
                Hủy
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground whitespace-pre-wrap wrap-break-word">
              {comment.content}
            </p>

            {/* Like Button */}
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-primary"
                onClick={() => onLike?.(comment._id)}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">{likes > 0 ? likes : ""}</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
