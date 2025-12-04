import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, Search, Image } from "lucide-react";
import { mangaService } from "@/services/manga.service";
import type { MangaListResponse } from "@/types/api";

const statusClasses = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  hiatus:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function MangaManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mangaList, setMangaList] = useState<MangaListResponse>({
    mangas: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  });

  const [loadingManga, setLoadingManga] = useState(false);

  const fetchMangaList = async () => {
    try {
      setLoadingManga(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 10,
      });
      if (response.data) {
        setMangaList(response.data);
      }
    } catch (error) {
      console.error("Error fetching featured mangas:", error);
    } finally {
      setLoadingManga(false);
    }
  };

  useEffect(() => {
    fetchMangaList();
  }, []);

  const filteredMangas = async () => {
    try {
      setLoadingManga(true);
      const response = await mangaService.getMangas({
        page: 1,
        limit: 10,
        search: searchTerm,
      });
      if (response.data) {
        setMangaList(response.data);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching featured mangas:", error);
    } finally {
      setLoadingManga(false);
    }
  };

  useEffect(() => {
    filteredMangas();
  }, [searchTerm]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Manga Management
          </h2>
          <p className="text-muted-foreground">
            Manage all titles and their metadata
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition">
          <Plus size={20} />
          Add Manga
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loadingManga ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                {[
                  "",
                  "Title",
                  "Author",
                  "Chapters",
                  "Status",
                  "Followers",
                  "Rating",
                  "Views",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-semibold text-card-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(9)].map((_, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${
                    i % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 bg-muted rounded"></div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-scroll">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="px-6 py-4 text-card-foreground w-auto"></th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-1/4">
                  Title
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Author
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Chapters
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Followers
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Rating
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Views
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground w-fit">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mangaList.mangas.map((manga, index) => (
                <tr
                  key={manga._id}
                  className={`border-b border-border hover:bg-accent/50 transition h-fit ${
                    index % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6  py-4 text-center text-card-foreground font-medium">
                    {manga.coverImage ? (
                      <img
                        src={manga.coverImage}
                        alt={`${manga.title} cover`}
                        className="w-12 h-16 rounded"
                      />
                    ) : (
                      <Image className="w-12 h-16 bg-muted rounded"></Image>
                    )}
                  </td>
                  <td className="px-8 py-4 text-card-foreground font-medium">
                    {manga.title}
                  </td>
                  <td className="px-6 py-4 text-center text-card-foreground">
                    {manga.author}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-center">
                    {manga.chapterCount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusClasses[manga.status] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {manga.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.followedCount}
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.averageRating}
                  </td>
                  <td className="px-6 py-4 text-card-foreground font-medium text-center">
                    {manga.viewCount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 rounded-lg hover:bg-accent transition text-card-foreground">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 transition text-destructive">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
