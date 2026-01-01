import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface BackButtonProps {
  fallbackPath?: string;
}

export const BackButton = ({ fallbackPath = "/" }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Tooltip delayDuration={600}>
      <TooltipTrigger asChild>
        <Button
          onClick={goBack}
          className={
            "absolute top-30 left-4 z-50 h-10 w-10 rounded-full shadow-md bg-card border border-border text-foreground hover:scale-105"
          }
          size="icon"
          aria-label="Quay về"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Quay về trang trước</TooltipContent>
    </Tooltip>
  );
};

export default BackButton;
