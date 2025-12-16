import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import type { RecommendedManga } from "@/types/ai";
import { useNavigate } from "react-router-dom";

interface RecommendationCardProps {
  recommendation: RecommendedManga;
  index: number;
}

export const RecommendationCard = ({
  recommendation,
  index,
}: RecommendationCardProps) => {
  const navigate = useNavigate();

  const handleViewManga = () => {
    navigate(`/manga/${recommendation.id}`);
  };

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold text-foreground flex-1">
            {index + 1}. {recommendation?.name || 'Truyện'}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            AI Đề xuất
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reason */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">
            Lý do đề xuất:
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {recommendation.reason}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleViewManga}
            className="w-full"
            variant="default"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Xem chi tiết truyện
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
