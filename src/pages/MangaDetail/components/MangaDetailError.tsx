import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

interface MangaDetailErrorProps {
  error?: string;
  onReturnHome: () => void;
}

export const MangaDetailError = ({
  error,
  onReturnHome,
}: MangaDetailErrorProps) => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Lỗi khi tầi truyện</h2>
        <p className="text-muted-foreground mb-4">
          {error || "Không tìm thấy truyện"}
        </p>
        <Button onClick={onReturnHome}>Trở về trang chủ</Button>
      </div>
    </MainLayout>
  );
};
