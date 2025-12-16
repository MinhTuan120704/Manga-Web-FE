import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { aiService } from "@/services/ai.service";
import type { RecommendedManga } from "@/types/ai";
import {
  DescriptionInput,
  RecommendationList,
  EmptyState,
  SuggestedGenres,
  LoadingAnimation,
} from "./components";
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { parseAIError } from "@/utils/errorHandler";

export const AIRecommendation = () => {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm truyện với AI" },
  ];

  const [recommendations, setRecommendations] = useState<RecommendedManga[]>(
    []
  );
  const [suggestedGenres, setSuggestedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    suggestion?: string;
  } | null>(null);

  const handleSubmit = async (description: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await aiService.getMangaByDescription({ description });

      if (response.recommendedMangas && response.recommendedMangas.length > 0) {
        setRecommendations(response.recommendedMangas);
        setSuggestedGenres(response.suggestedGenres || []);

        toast.success(
          `Đã tìm thấy ${response.recommendedMangas.length} đề xuất!`
        );
      } else {
        setRecommendations([]);
        setSuggestedGenres([]);
        toast.info("Không tìm thấy đề xuất phù hợp. Thử mô tả khác nhé!");
      }
    } catch (err) {
      console.error("AI recommendation error:", err);
      const parsedError = parseAIError(err);
      
      setError({
        message: parsedError.message,
        suggestion: parsedError.suggestion,
      });
      
      toast.error(parsedError.message, {
        description: parsedError.suggestion,
        duration: 5000,
      });
      
      setRecommendations([]);
      setSuggestedGenres([]);
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
          <Alert variant="destructive" className="border-l-4">
            <AlertCircle className="h-5 w-5" />
            <div className="ml-3 flex-1 space-y-2">
              <div>
                <p className="font-semibold text-base">{error.message}</p>
              </div>
              {error.suggestion && (
                <div className="flex items-start gap-2 pt-1">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 opacity-80" />
                  <p className="text-sm opacity-90">{error.suggestion}</p>
                </div>
              )}
            </div>
          </Alert>
        )}

        {/* Suggested Genres */}
        {!loading && suggestedGenres.length > 0 && (
          <SuggestedGenres genres={suggestedGenres} />
        )}

        {/* Results Section */}
        <div>
          {loading ? (
            <LoadingAnimation />
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
