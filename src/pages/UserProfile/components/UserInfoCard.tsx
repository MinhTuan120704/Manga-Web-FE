import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UpdateUserInfoModal } from "./UpdateUserInfoModal";
import type { User } from "@/types";

export const UserInfoCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Set initial user from localStorage
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser as User);
      }

      setLoading(true);
      try {
        const response = await userService.getMyProfile();
        if (response.data) {
          setUser(response.data);
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Keep using stored user data on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getRoleBadge = (role: string) => {
    const badges = {
      reader: "Người đọc truyện / đọc truyện",
      uploader: "Người đăng truyện / đăng truyện",
      admin: "Quản trị viên",
    };
    return badges[role as keyof typeof badges] || badges.reader;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted animate-pulse" />
          <div className="w-32 h-5 bg-muted animate-pulse rounded" />
          <div className="w-40 h-6 bg-muted animate-pulse rounded" />
          <div className="w-full h-9 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.username || "User"
              )}&background=random&size=128`}
            />
            <AvatarFallback className="text-xl sm:text-2xl">
              {user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center w-full">
            <h2 className="text-foreground font-semibold text-base sm:text-lg break-words px-2">
              {user?.username || "John Doe"}
            </h2>
            <Badge
              variant="default"
              className="mt-2 text-xs break-words max-w-full inline-block"
            >
              {getRoleBadge(user?.role || "reader")}
            </Badge>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </Button>
        </div>
      </div>
      <UpdateUserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
