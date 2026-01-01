import { BookOpen, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ReadingProgressInfoProps {
  mangaId: string;
  chapterId: string;
  currentChapterNumber: number;
  totalChapters: number;
  progress: number;
  chapterTitle?: string;
}

export const ReadingProgressInfo = ({
  mangaId,
  chapterId,
  currentChapterNumber,
  totalChapters,
  progress,
  chapterTitle,
}: ReadingProgressInfoProps) => {
  const navigate = useNavigate();

  const handleContinueReading = () => {
    navigate(`/reader/${chapterId}`);
  };

  return (
    <div className="w-full p-3 bg-card border border-border rounded-lg space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen className="size-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            Chương {currentChapterNumber}
          </span>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {currentChapterNumber}/{totalChapters}
        </span>
      </div>

      {chapterTitle && (
        <p className="text-xs text-muted-foreground truncate pl-6">
          {chapterTitle}
        </p>
      )}

      <div className="space-y-1">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Tiến độ</span>
          <span className="text-xs font-semibold text-primary">
            {progress}%
          </span>
        </div>
      </div>

      <Button
        onClick={handleContinueReading}
        className="w-full mt-2"
        size="sm"
        variant="default"
      >
        <Play className="size-4 mr-2" />
        Tiếp tục đọc
      </Button>
    </div>
  );
};
