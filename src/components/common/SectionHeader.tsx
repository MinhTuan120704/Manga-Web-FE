import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  viewAllPath?: string;
  viewAllParams?: Record<string, string>;
}

export function SectionHeader({
  title,
  subtitle,
  showViewAll = false,
  onViewAll,
  viewAllPath,
  viewAllParams,
}: SectionHeaderProps) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllPath) {
      const searchParams = new URLSearchParams(viewAllParams);
      navigate(`${viewAllPath}?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {showViewAll && (
        <Button
          variant="ghost"
          onClick={handleViewAll}
          className="flex items-center gap-1"
        >
          Xem tất cả
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
