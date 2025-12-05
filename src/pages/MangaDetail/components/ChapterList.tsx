import { useState } from "react";
import { BookOpen, User, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User as UserType } from "@/types/user";
import type { Chapter } from "@/types/chapter";

interface ChapterListProps {
  chapters: Chapter[];
  onChapterClick: (chapterId: string) => void;
}

export const ChapterList = ({ chapters, onChapterClick }: ChapterListProps) => {
  const [chapterSearch, setChapterSearch] = useState("");
  const [chapterSort, setChapterSort] = useState<"asc" | "desc">("desc");

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
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
  };

  const getUploader = (uploader: string | UserType | undefined): string => {
    if (!uploader) return "Không rõ";
    return typeof uploader === "string"
      ? uploader
      : uploader.username || "Không rõ";
  };

  const filteredChapters = chapters
    .filter((chapter) => {
      const searchLower = chapterSearch.toLowerCase();
      return (
        chapter.title.toLowerCase().includes(searchLower) ||
        chapter.chapterNumber.toString().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (chapterSort === "asc") {
        return a.chapterNumber - b.chapterNumber;
      }
      return b.chapterNumber - a.chapterNumber;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Danh sách chapter</span>
          <Badge variant="outline">{chapters.length} Chapter</Badge>
        </CardTitle>

        {/* Chapter Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chapter..."
              value={chapterSearch}
              onChange={(e) => setChapterSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={chapterSort}
            onValueChange={(value: "asc" | "desc") => setChapterSort(value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Mới nhất</SelectItem>
              <SelectItem value="asc">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredChapters.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {chapters.length === 0
                ? "Chưa có chapter nào"
                : "Không tìm thấy chapter phù hợp"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChapters.map((chapter) => (
              <div
                key={chapter._id}
                onClick={() => onChapterClick(chapter._id)}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge variant="outline">Ch. {chapter.chapterNumber}</Badge>
                    <h4 className="font-medium group-hover:text-primary transition-colors truncate">
                      {chapter.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {chapter.uploaderId && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{getUploader(chapter.uploaderId)}</span>
                      </div>
                    )}
                    {chapter.createdAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(chapter.createdAt)}</span>
                      </div>
                    )}
                    {chapter.pages && chapter.pages.length > 0 && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{chapter.pages.length} trang</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Đọc
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
