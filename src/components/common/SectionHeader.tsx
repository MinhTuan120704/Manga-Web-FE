import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  showViewAll = false,
  onViewAll,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {showViewAll && (
        <Button
          variant="ghost"
          onClick={onViewAll}
          className="flex items-center gap-1"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
