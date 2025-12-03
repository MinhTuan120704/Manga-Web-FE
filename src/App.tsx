import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { router } from "@/router";
import { Toaster } from "sonner";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
      <Toaster
        position="top-right"
        theme={darkMode ? "dark" : "light"}
        richColors
        closeButton
        duration={3000}
      />
    </>
  );
}

export default App;
