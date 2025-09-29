import { useState } from "react";
import { Homepage } from "@/pages/Homepage";

interface AppRouterProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function AppRouter({ darkMode, onToggleDarkMode }: AppRouterProps) {
  const [currentPage, setCurrentPage] = useState<"home" | "demo">("home");

  // Simple routing logic - trong thực tế sẽ dùng React Router
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage />;
      case "demo":
        // Import DemoPage khi cần
        return <div>Demo Page (to be implemented)</div>;
      default:
        return <Homepage />;
    }
  };

  return renderPage();
}
