/* import { AuthFooter } from "@/pages/Auth"; */

interface AuthLayoutProps {
  children: React.ReactNode;
  disableScroll?: boolean;
}

export function AuthLayout({ children, disableScroll = false }: AuthLayoutProps) {
  return (
    <div 
      className={`min-h-screen w-full flex flex-col ${
        disableScroll ? 'overflow-hidden' : 'overflow-auto'
      }`}
    >
      {/* Main content area - centered/ */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      {/* <AuthFooter /> */}
    </div>
  );
}