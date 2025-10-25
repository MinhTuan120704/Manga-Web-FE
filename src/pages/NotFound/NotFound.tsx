import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  const goBack = () => {
    navigate(-1);
  };
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Coffee className="w-32 h-32" />
        </EmptyMedia>
        <EmptyTitle>404 Not found...</EmptyTitle>
        <EmptyDescription>
          The page you are trying to reach is not existed... <br />
          Go back to home page?
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={goHome}>To home</Button>
          <Button variant="outline" onClick={goBack}>
            Go back to last page
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
