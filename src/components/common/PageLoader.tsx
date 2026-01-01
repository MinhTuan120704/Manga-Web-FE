export const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="relative">
      {/* Animated spinning circle */}
      <div className="w-64 h-64 rounded-full border-4 border-dashed border-primary animate-spin [animation-duration:20s]"></div>

      {/* Logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/mangaria_logo.png"
          alt="Mangaria Logo"
          className="w-40 h-40 object-contain"
        />
      </div>
    </div>
  </div>
);
