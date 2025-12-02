import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UpdateUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateUserInfoModal = ({
  isOpen,
  onClose,
}: UpdateUserInfoModalProps) => {
  const user = authService.getStoredUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isOpen && user) {
        setFetchingProfile(true);
        try {
          // Fetch full user profile to get email and other details
          const response = await userService.getMyProfile();
          const profile = response.data;

          if (profile) {
            // Parse username into firstName and lastName
            const nameParts = profile.username.split(" ");
            setFormData({
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              email: profile.email || "",
              bio: "", // Add bio field to User type if needed
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Fallback to stored user data
          const nameParts = user.username.split(" ");
          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: "",
            bio: "",
          });
        } finally {
          setFetchingProfile(false);
        }
      }
    };

    fetchUserProfile();
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = `${formData.firstName} ${formData.lastName}`.trim();
      const updateData: { username?: string; email?: string } = {};

      if (username) updateData.username = username;
      if (formData.email) updateData.email = formData.email;

      await userService.updateProfile(updateData);

      // Update localStorage with new user data
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          username,
          email: formData.email || "",
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      onClose();
      window.location.reload(); // Reload to show updated info
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-popover rounded-lg p-4 sm:p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-popover-foreground">
            Chỉnh sửa thông tin
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {fetchingProfile ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      formData.firstName || "User"
                    )}&background=random&size=128`}
                  />
                  <AvatarFallback className="text-xl sm:text-2xl">
                    {formData.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Họ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Tên"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="min-h-[80px] sm:min-h-[100px]"
                  placeholder="Giới thiệu"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={loading || fetchingProfile}
                  className="flex-1"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
