import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReadingDirection } from "../MangaReader";

interface ReadingDirectionOverlayProps {
  direction: ReadingDirection;
  show: boolean;
}

export function ReadingDirectionOverlay({
  direction,
  show,
}: ReadingDirectionOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, direction]);

  if (!visible) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="bg-black/90 backdrop-blur-md text-white px-8 py-4 rounded-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4">
          {direction === "rtl" ? (
            <>
              <ArrowLeft className="h-6 w-6 animate-pulse" />
              <div className="text-center">
                <div className="font-semibold text-lg">Right to Left</div>
              </div>
              <ArrowLeft className="h-6 w-6 animate-pulse" />
            </>
          ) : (
            <>
              <ArrowRight className="h-6 w-6 animate-pulse" />
              <div className="text-center">
                <div className="font-semibold text-lg">Left to Right</div>
              </div>
              <ArrowRight className="h-6 w-6 animate-pulse" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
