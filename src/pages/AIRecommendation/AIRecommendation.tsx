import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { aiService } from "@/services/ai.service";
import type { AIRecommendation as AIRecommendationType } from "@/types/ai";
import { DescriptionInput, RecommendationList, EmptyState } from "./components";
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const AIRecommendation = () => {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm truyện với AI" },
  ];

  const [recommendations, setRecommendations] = useState<
    AIRecommendationType[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (description: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await aiService.getMangaByDescription({ description });

      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations(response.recommendations);
        toast.success(
          `Đã tìm thấy ${response.recommendations.length} đề xuất!`
        );
      } else {
        setRecommendations([]);
        toast.info("Không tìm thấy đề xuất phù hợp. Thử mô tả khác nhé!");
      }
    } catch (err) {
      console.error("AI recommendation error:", err);
      const errorMessage =
        (err as Error)?.message ||
        "Không thể tạo đề xuất. Vui lòng thử lại sau.";
      setError(errorMessage);
      toast.error(errorMessage);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Tìm truyện với AI
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Mô tả loại truyện bạn muốn đọc và AI sẽ gợi ý những câu chuyện phù
            hợp nhất với sở thích của bạn
          </p>
        </div>

        {/* Input Section */}
        <div className="mx-auto">
          <DescriptionInput onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Error Alert */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <p className="font-medium">Đã xảy ra lỗi</p>
              <p className="text-sm">{error}</p>
            </div>
          </Alert>
        )}

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-muted-foreground animate-pulse">
                AI đang phân tích yêu cầu của bạn...
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <RecommendationList recommendations={recommendations} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
