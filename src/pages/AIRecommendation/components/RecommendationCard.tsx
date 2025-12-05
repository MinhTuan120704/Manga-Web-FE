import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Hash } from "lucide-react";
import type { AIRecommendation } from "@/types/ai";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  index: number;
}

export const RecommendationCard = ({
  recommendation,
  index,
}: RecommendationCardProps) => {
  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold text-foreground flex-1">
            {index + 1}. {recommendation.title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            AI Đề xuất
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {recommendation.description}
        </p>

        {/* Genres */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Thể loại:</h4>
          <div className="flex flex-wrap gap-2">
            {recommendation.genres.map((genre, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">
                Phong cách tác giả
              </p>
              <p className="font-medium text-foreground truncate">
                {recommendation.suggestedAuthor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">
                Số chapter dự kiến
              </p>
              <p className="font-medium text-foreground">
                ~{recommendation.estimatedChapters}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
