import { useEffect, useState } from "react";
import {
  Sparkles,
  Brain,
  BookOpen,
  Wand2,
  Stars,
  Lightbulb,
} from "lucide-react";

const loadingMessages = [
  {
    text: "AI đang phân tích yêu cầu của bạn...",
    icon: Brain,
  },
  {
    text: "Đang tìm kiếm trong hàng ngàn bộ truyện...",
    icon: BookOpen,
  },
  {
    text: "Đang so sánh các thể loại phù hợp...",
    icon: Sparkles,
  },
  {
    text: "AI đang suy nghĩ kỹ lưỡng...",
    icon: Lightbulb,
  },
  {
    text: "Đang tạo ra những gợi ý tuyệt vời...",
    icon: Wand2,
  },
  {
    text: "Sắp xong rồi, chờ tí nhé...",
    icon: Stars,
  },
];

export const LoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setFade(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = loadingMessages[messageIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Spinner with pulse effect */}
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/20 animate-ping" />
      </div>

      {/* Animated message with icon */}
      <div
        className={`flex flex-col items-center space-y-3 transition-all duration-300 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <Icon className="h-8 w-8 text-primary" />
        <p className="text-muted-foreground text-center text-base font-medium px-4 max-w-md">
          {currentMessage.text}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {loadingMessages.map((message, index) => (
          <div
            key={message.text}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === messageIndex
                ? "bg-primary w-8"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Fun fact or tip */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground italic">
          Mẹo: Mô tả càng chi tiết, kết quả càng chính xác~
        </p>
      </div>
    </div>
  );
};
