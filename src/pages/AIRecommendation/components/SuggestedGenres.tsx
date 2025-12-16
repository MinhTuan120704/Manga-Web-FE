import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";

interface SuggestedGenresProps {
  genres: string[];
}

export const SuggestedGenres = ({ genres }: SuggestedGenresProps) => {
  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent>
        <div className="flex items-start gap-3">
          <Tag className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-3 flex-1">
            <h3 className="text-base font-semibold text-foreground">
              Thể loại được đề xuất cho bạn
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="text-sm px-3 py-1"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
