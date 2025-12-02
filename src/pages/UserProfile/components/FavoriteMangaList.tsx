import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { MangaCard } from "@/components/common/MangaCard";
import type { Manga } from "@/types";

export const FavoriteMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedMangas = async () => {
      try {
        const response = await userService.getFollowedMangas();
        setMangas(response.data?.mangas || []);
      } catch (error) {
        console.error("Failed to fetch followed mangas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedMangas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Truyện đã đăng / theo dõi
      </h2>
      {mangas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base sm:text-lg">
            Chưa có truyện nào được theo dõi
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {mangas.map((manga) => (
            <MangaCard key={manga._id} manga={manga} />
          ))}
        </div>
      )}
    </div>
  );
};
