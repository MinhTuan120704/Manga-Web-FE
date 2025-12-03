import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ratingService } from "@/services/rating.service";
import { authService } from "@/services/auth.service";
import { RatingStars } from "./RatingStars";
import { Star, Users } from "lucide-react";
import { toast } from "sonner";

interface RatingSectionProps {
  mangaId: string;
  initialAverageRating?: number;
  initialTotalRatings?: number;
}

export const RatingSection = ({
  mangaId,
  initialAverageRating = 0,
  initialTotalRatings = 0,
}: RatingSectionProps) => {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRatingData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch average rating
      const avgResponse = await ratingService.getMangaAverageRating(mangaId);
      if (avgResponse.data) {
        setAverageRating(avgResponse.data.averageRating);
        setTotalRatings(avgResponse.data.totalRatings);
      }

      // Fetch user's rating if logged in
      if (authService.isAuthenticated()) {
        try {
          const userResponse = await ratingService.getUserRatingForManga(
            mangaId
          );
          if (userResponse.data?.rating) {
            setUserRating(userResponse.data.rating.star);
            setSelectedRating(userResponse.data.rating.star);
          }
        } catch {
          // User hasn't rated yet
          console.log("User has not rated this manga yet");
        }
      }
    } catch (error) {
      console.error("Failed to fetch rating data:", error);
    } finally {
      setLoading(false);
    }
  }, [mangaId]);

  useEffect(() => {
    fetchRatingData();
  }, [fetchRatingData]);

  const handleRatingChange = (rating: number) => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để đánh giá truyện");
      navigate("/login");
      return;
    }
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để đánh giá truyện");
      navigate("/login");
      return;
    }

    if (selectedRating === 0) {
      toast.error("Vui lòng chọn số sao để đánh giá");
      return;
    }

    try {
      setSubmitting(true);
      const response = await ratingService.rateManga({
        manga: mangaId,
        star: selectedRating,
      });

      // Update local state with the returned rating
      if (response) {
        setUserRating(response.star);
        setSelectedRating(response.star);
      }

      // Refresh rating data to get updated average
      await fetchRatingData();

      toast.success(
        userRating ? "Đã cập nhật đánh giá thành công!" : "Đánh giá thành công!"
      );
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-card border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Đánh giá truyện
          </h2>
        </div>

        {/* Average Rating Display */}
        {!loading && (
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </div>
              <RatingStars rating={averageRating} size="md" />
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Users className="w-4 h-4" />
                <span>{totalRatings} đánh giá</span>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage =
                  totalRatings > 0
                    ? ((totalRatings * (star / 5)) / totalRatings) * 100
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-6">
                      {star}
                    </span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User Rating Input */}
        {authService.isAuthenticated() && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                {userRating ? "Cập nhật đánh giá của bạn" : "Đánh giá của bạn"}
              </label>
              <div className="flex items-center gap-4">
                <RatingStars
                  rating={selectedRating}
                  size="lg"
                  interactive
                  onChange={handleRatingChange}
                />
                {selectedRating > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedRating} sao
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmitRating}
              disabled={submitting || selectedRating === 0}
              className="w-full sm:w-auto"
            >
              {submitting
                ? "Đang gử i..."
                : userRating
                ? "Cập nhật đánh giá"
                : "Gửi đánh giá"}
            </Button>
          </div>
        )}

        {/* Login prompt */}
        {!authService.isAuthenticated() && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Vui lòng đăng nhập để đánh giá truyện
            </p>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
