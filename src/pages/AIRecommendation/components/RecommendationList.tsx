import { RecommendationCard } from "./RecommendationCard";
import type { AIRecommendation } from "@/types/ai";
import { Sparkles } from "lucide-react";

interface RecommendationListProps {
  recommendations: AIRecommendation[];
}

export const RecommendationList = ({
  recommendations,
}: RecommendationListProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Kết quả đề xuất ({recommendations.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} index={index} />
        ))}
      </div>
    </div>
  );
};
