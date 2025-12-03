import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { UserInfoCard } from "./components/UserInfoCard";
import { UserTitle } from "./components/UserTitle";
import { FavoriteMangaList } from "./components/FavoriteMangaList";
import { MangaReadingHistory } from "./components/MangaReadingHistory";
import type { User } from "@/types";

export const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        if (response) {
          setUserProfile(response);
          console.log(response);

          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(response));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row bg-background min-h-full">
        <div className="w-full lg:w-[280px] xl:w-[320px] p-4 border-b lg:border-b-0 lg:border-r border-border flex-shrink-0">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 min-w-0">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-background min-h-full">
      {/* Left Sidebar - User Info */}
      <div className="w-full lg:w-[280px] xl:w-[320px] p-4 border-b lg:border-b-0 lg:border-r border-border flex-shrink-0">
        <UserInfoCard user={userProfile} />
        <UserTitle user={userProfile} />
      </div>

      {/* Main Content - Followed Manga & Reading History */}
      <div className="flex-1 p-4 sm:p-6 min-w-0 space-y-8">
        <FavoriteMangaList
          followedMangaIds={userProfile?.followedMangas || []}
        />
        <MangaReadingHistory
          readingHistory={userProfile?.readingHistory || []}
        />
      </div>
    </div>
  );
};
