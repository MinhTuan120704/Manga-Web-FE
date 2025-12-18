import { Heart } from "lucide-react";

export function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-1">
        <span>© {currentYear} Mangaria. Made with</span>
        <Heart className="h-4 w-4 text-red-500 fill-current" />
      </div>
    </footer>
  );
}