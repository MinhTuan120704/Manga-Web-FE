import { BookOpen } from "lucide-react";

export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="relative">
      {/* Animated spinning circle */}
      <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary animate-spin [animation-duration:20s]"></div>

      {/* Icon in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BookOpen className="w-32 h-32 text-primary" />
      </div>
    </div>
  </div>
);
