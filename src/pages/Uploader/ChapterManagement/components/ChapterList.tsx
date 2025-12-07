import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Chapter } from "@/types/chapter";

interface ChapterListProps {
  chapters: Chapter[];
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapterId: string) => void;
}

export function ChapterList({ chapters, onEdit, onDelete }: ChapterListProps) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/10 items-center justify-center flex flex-col">
          <p className="text-muted-foreground mb-2">Chưa có chương nào được đăng tải</p>
          <p className="text-xs text-muted-foreground">Hãy thêm chương đầu tiên cho truyện này</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium">
            <tr>
              <th className="px-4 py-3 w-[100px]">Chương</th>
              <th className="px-4 py-3">Tên chương</th>
              <th className="px-4 py-3">Ngày đăng</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {chapters.map((chapter) => (
              <tr key={chapter._id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">#{chapter.chapterNumber}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                      <span className="font-medium">{chapter.title || `Chapter ${chapter.chapterNumber}`}</span>
                      <span className="text-xs text-muted-foreground">{chapter.pages?.length || 0} trang</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-3 w-3" />
                    {formatDate(chapter.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(chapter)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(chapter._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa chương
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
