import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import type { Genre } from "@/types";

interface GenreSelectorProps {
  genres: Genre[];
  loading: boolean;
  selectedGenreIds: string[];
  onChange: (genreIds: string[]) => void;
}

export const GenreSelector = ({
  genres,
  loading,
  selectedGenreIds,
  onChange,
}: GenreSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleToggleGenre = (genreId: string) => {
    if (selectedGenreIds.includes(genreId)) {
      onChange(selectedGenreIds.filter((id) => id !== genreId));
    } else {
      onChange([...selectedGenreIds, genreId]);
    }
  };

  const handleRemoveGenre = (genreId: string) => {
    onChange(selectedGenreIds.filter((id) => id !== genreId));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g._id));

  return (
    <div className="space-y-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={loading}
          >
            <span className="text-sm">
              {loading
                ? "Đang tải..."
                : selectedGenreIds.length > 0
                ? `Đã chọn ${selectedGenreIds.length} thể loại`
                : "Chọn thể loại"}
            </span>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
          <div className="p-2 space-y-2">
            {genres.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Không có thể loại nào
              </p>
            ) : (
              genres.map((genre) => (
                <div
                  key={genre._id}
                  className="flex items-center space-x-2 hover:bg-accent p-2 rounded-md cursor-pointer"
                  onClick={() => handleToggleGenre(genre._id)}
                >
                  <Checkbox
                    id={genre._id}
                    checked={selectedGenreIds.includes(genre._id)}
                    onCheckedChange={() => handleToggleGenre(genre._id)}
                  />
                  <Label
                    htmlFor={genre._id}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {genre.name}
                    {genre.mangaCount !== undefined && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({genre.mangaCount})
                      </span>
                    )}
                  </Label>
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Genres */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <Badge key={genre._id} variant="secondary" className="gap-1 pr-1">
              <span className="text-xs">{genre.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveGenre(genre._id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleClearAll}
          >
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  );
};
