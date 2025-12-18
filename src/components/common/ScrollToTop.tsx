import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Tìm container scroll trong MainLayout
      const mainContainer = document.querySelector("main.overflow-auto");

      if (mainContainer) {
        // Hiển thị button khi scroll xuống > 300px trong container
        if (mainContainer.scrollTop > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Fallback về window scroll nếu không tìm thấy container
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    // Lắng nghe scroll của container
    const mainContainer = document.querySelector("main.overflow-auto");

    if (mainContainer) {
      mainContainer.addEventListener("scroll", toggleVisibility);
    }
    window.addEventListener("scroll", toggleVisibility);

    // Kiểm tra ngay khi mount
    toggleVisibility();

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", toggleVisibility);
      }
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Tìm container scroll trong MainLayout
    const mainContainer = document.querySelector(
      "main.overflow-auto"
    ) as HTMLElement | null;
    const startPosition = mainContainer
      ? mainContainer.scrollTop
      : window.scrollY;
    const duration = 1000; // 1 giây
    let startTime: number | null = null;

    // Easing function - tăng tốc dần dần
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = easeInOutCubic(progress);
      const position = startPosition * (1 - easing);

      if (mainContainer) {
        mainContainer.scrollTop = position;
      } else {
        window.scrollTo(0, position);
      }

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-[9999] h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90 text-primary-foreground",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      )}
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  );
};
