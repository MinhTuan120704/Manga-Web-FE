import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { ConfirmationModal } from "./ConfirmationModal";
import { commentService } from "@/services/comment.service";
import { authService } from "@/services/auth.service";
import type { Comment } from "@/types/comment";
import { toast } from "sonner";

interface CommentSectionProps {
  mangaId?: string;
  chapterId?: string;
  title?: string;
}

export function CommentSection({
  mangaId,
  chapterId,
  title = "Bình luận",
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const currentUser = authService.getStoredUser();

  const fetchComments = async () => {
    try {
      setLoading(true);
      let response;

      if (mangaId) {
        response = await commentService.getCommentsByMangaId(mangaId);
      } else if (chapterId) {
        response = await commentService.getCommentsByChapterId(chapterId);
      }

      if (response) {
        // Filter out comments with null/undefined users
        const validComments = response.filter(comment => comment.user != null);
        setComments(validComments);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaId, chapterId]);

  const handleSubmitComment = async (content: string) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    try {
      setSubmitting(true);
      await commentService.createComment({
        content,
        manga: mangaId,
        chapter: chapterId,
      });

      toast.success("Bình luận thành công!");
      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      await commentService.updateComment(commentId, { content: newContent });
      toast.success("Cập nhật bình luận thành công!");
      await fetchComments();
    } catch (error) {
      console.error("Failed to edit comment:", error);
      toast.error("Không thể chỉnh sửa bình luận. Vui lòng thử lại.");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setDeleting(true);
      await commentService.deleteComment(commentToDelete);
      toast.success("Xóa bình luận thành công!");
      await fetchComments();
      setDeleteModalOpen(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Không thể xóa bình luận. Vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement like functionality
    console.log("Like comment:", commentId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title}
          <span className="text-muted-foreground font-normal text-sm ml-2">
            ({comments.length})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Input */}
        {currentUser ? (
          <CommentInput
            username={currentUser.username}
            onSubmit={handleSubmitComment}
            isSubmitting={submitting}
          />
        ) : (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Vui lòng đăng nhập để bình luận
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-0">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-3 py-4 border-b border-border"
              >
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUser?._id}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
              />
            ))
          )}
        </div>
      </CardContent>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCommentToDelete(null);
        }}
        onConfirm={confirmDeleteComment}
        title="Xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        loading={deleting}
      />
    </Card>
  );
}
