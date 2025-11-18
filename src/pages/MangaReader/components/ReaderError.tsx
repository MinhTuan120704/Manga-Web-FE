import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReaderErrorProps {
  error: string;
  onReturnToManga: () => void;
}

export function ReaderError({ error, onReturnToManga }: ReaderErrorProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Chapter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onReturnToManga}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
