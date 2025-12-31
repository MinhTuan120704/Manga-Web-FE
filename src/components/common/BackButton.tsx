import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
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
