import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Eye } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { RecentUpdate, Manga } from "@/types/manga";

interface RecentUpdatesProps {
  updates: RecentUpdate[];
  onPreview?: (manga: Manga) => void;
}

export function RecentUpdates({ updates, onPreview }: RecentUpdatesProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Recent Updates"
        subtitle="Latest manga chapter releases"
        showViewAll
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((update) => (
          <Card
            key={`${update.manga.id}-${update.chapter.id}`}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={update.manga.coverUrl}
                  alt={update.manga.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                    {update.manga.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    Chapter {update.chapter.number}: {update.chapter.title}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {update.manga.genres[0]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {update.timeAgo}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {update.chapter.pages} pages
                    </span>
                    <div className="flex items-center gap-2">
                      {onPreview && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPreview(update.manga);
                          }}
                          className="h-6 px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
