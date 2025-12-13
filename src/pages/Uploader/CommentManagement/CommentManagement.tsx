import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UploaderLayout } from "@/components/layout/UploaderLayout";
import { commentService } from "@/services/comment.service";
import { toast } from "sonner";
import type { Comment } from "@/types/comment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export function CommentManagement() {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByUploader();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Không thể tải danh sách bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (comment: Comment) => {
    if (comment.chapter && typeof comment.chapter !== "string") {
      navigate(`/reader/${comment.chapter._id}`);
    } else if (comment.manga && typeof comment.manga !== "string") {
      navigate(`/manga/${comment.manga._id}`);
    }
  };

  const handleDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await commentService.deleteComment(commentToDelete);
      toast.success("Đã xóa bình luận");
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Xóa bình luận thất bại");
    }
  };

  return (
    <UploaderLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/uploader" },
        { label: "Quản lý bình luận" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Quản lý bình luận</h1>
            <p className="text-sm text-muted-foreground">
              Xem và quản lý bình luận trên các truyện của bạn
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-md">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{comments.length}</span>
            <span className="text-xs text-muted-foreground">bình luận</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Chưa có bình luận nào trên các bộ truyện của bạn
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Người dùng</TableHead>
                    <TableHead className="w-[250px]">Nội dung</TableHead>
                    <TableHead className="w-[200px]">Truyện / Chương</TableHead>
                    <TableHead className="w-[150px]">Thời gian</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow
                      key={comment._id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleNavigate(comment)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                typeof comment.user !== "string"
                                  ? comment.user?.avatarUrl
                                  : undefined
                              }
                            />
                            <AvatarFallback>
                              {typeof comment.user !== "string"
                                ? comment.user?.username
                                    ?.charAt(0)
                                    .toUpperCase()
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {typeof comment.user !== "string"
                                ? comment.user?.username
                                : "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {typeof comment.user !== "string"
                                ? comment.user?.role
                                : ""}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm line-clamp-2">
                          {comment.content}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 font-medium text-sm">
                            <span>
                              {typeof comment.manga !== "string"
                                ? comment.manga?.title
                                : ""}
                            </span>
                          </div>
                          {comment.chapter &&
                            typeof comment.chapter !== "string" && (
                              <Badge variant="outline" className="w-fit">
                                Chương {comment.chapter.chapterNumber}
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(comment._id);
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCommentToDelete(null);
        }}
        onConfirm={confirmDeleteComment}
        title="Xác nhận xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
        confirmText="Xóa bình luận"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </UploaderLayout>
  );
}
