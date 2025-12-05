import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenreSelector } from "./GenreSelector";
import type { Genre } from "@/types/genre";
import { Filter, ArrowUpDown } from "lucide-react";

interface SearchFiltersProps {
  genres: Genre[];
  loadingGenres: boolean;
  selectedGenres: string[];
  selectedStatus: string;
  sortBy: string;
  onGenresChange: (genreIds: string[]) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
}

export const SearchFilters = ({
  genres,
  loadingGenres,
  selectedGenres,
  selectedStatus,
  sortBy,
  onGenresChange,
  onStatusChange,
  onSortChange,
}: SearchFiltersProps) => {
  return (
    <Card className="p-4 sm:p-6 bg-card border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
        </div>

        {/* Genre Selector */}
        <div className="space-y-2">
          <Label htmlFor="genres" className="text-sm font-medium">
            Thể loại
          </Label>
          <GenreSelector
            genres={genres}
            loading={loadingGenres}
            selectedGenreIds={selectedGenres}
            onChange={onGenresChange}
          />
        </div>

        {/* Status and Sort Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="ongoing">Đang tiến hành</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="hiatus">Tạm ngưng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <Label
              htmlFor="sort"
              className="text-sm font-medium flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sắp xếp
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Chọn cách sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Mới nhất</SelectItem>
                <SelectItem value="createdAt">Cũ nhất</SelectItem>
                <SelectItem value="-updatedAt">Cập nhật gần đây</SelectItem>
                <SelectItem value="-viewCount">Xem nhiều nhất</SelectItem>
                <SelectItem value="-averageRating">Đánh giá cao</SelectItem>
                <SelectItem value="-followedCount">Theo dõi nhiều</SelectItem>
                <SelectItem value="title">Tên A-Z</SelectItem>
                <SelectItem value="-title">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
