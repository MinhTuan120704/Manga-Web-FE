export const UserTitle = () => {
  return (
    <div className="mt-4">
      <h3 className="text-foreground font-semibold mb-2 text-sm sm:text-base">
        Thông tin
      </h3>
      <div className="bg-card rounded-lg p-3 sm:p-4 border border-border">
        <div className="mb-3">
          <span className="text-muted-foreground text-xs sm:text-sm">
            Đã đăng / theo dõi:
          </span>
          <p className="text-foreground font-semibold text-sm sm:text-base">
            0
          </p>
        </div>
        <div>
          <span className="text-muted-foreground text-xs sm:text-sm">
            Giới thiệu:
          </span>
          <p className="text-foreground text-xs sm:text-sm mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
    </div>
  );
};
