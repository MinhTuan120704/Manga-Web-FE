import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars = ({
  rating,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2, 3, 4].map((index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = !isFilled && index < rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={cn(
              "relative transition-all",
              interactive && "cursor-pointer hover:scale-110 active:scale-95",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled || isHalf
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-muted-foreground",
                interactive && "hover:text-yellow-400"
              )}
              style={
                isHalf
                  ? {
                      clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                    }
                  : undefined
              }
            />
            {isHalf && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute top-0 left-0 fill-none text-muted-foreground"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
