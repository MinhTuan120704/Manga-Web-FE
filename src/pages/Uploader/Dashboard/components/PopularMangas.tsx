import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Star, TrendingUp, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Manga } from "@/types/manga";

interface PopularMangasProps {
  mangas: Manga[];
}

export function PopularMangas({ mangas }: PopularMangasProps) {
  const navigate = useNavigate();

  // Sort by viewCount và lấy top 5
  const sortedMangas = [...mangas]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  if (sortedMangas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Truyện phổ biến nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có dữ liệu thống kê</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Truyện phổ biến nhất
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMangas.map((manga, index) => (
            <div
              key={manga._id}
              onClick={() => navigate(`/manga/${manga._id}`)}
              className="group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                    {manga.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{(manga.viewCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{manga.averageRating?.toFixed(1) || "N/A"}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-medium">
                        {manga.progress || 0}%
                      </span>
                    </div>
                    <Progress value={manga.progress || 0} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
