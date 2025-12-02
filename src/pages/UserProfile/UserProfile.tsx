import { UserInfoCard } from "./components/UserInfoCard";
import { UserTitle } from "./components/UserTitle";
import { FavoriteMangaList } from "./components/FavoriteMangaList";

export const UserProfile = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-background min-h-full">
      {/* Left Sidebar - User Info */}
      <div className="w-full lg:w-[280px] xl:w-[320px] p-4 border-b lg:border-b-0 lg:border-r border-border flex-shrink-0">
        <UserInfoCard />
        <UserTitle />
      </div>

      {/* Main Content - Followed Manga */}
      <div className="flex-1 p-4 sm:p-6 min-w-0">
        <FavoriteMangaList />
      </div>
    </div>
  );
};
