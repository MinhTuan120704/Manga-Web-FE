import { useState } from "react";
import { Trash2, Edit2, Plus, Search } from "lucide-react";

const mangaList = [
  {
    id: 1,
    title: "Jujutsu Kaisen",
    author: "Gege Akutami",
    chapters: 247,
    status: "Publishing",
    rating: 8.9,
  },
  {
    id: 2,
    title: "Chainsawman",
    author: "Tatsuki Fujimoto",
    chapters: 168,
    status: "Publishing",
    rating: 8.7,
  },
  {
    id: 3,
    title: "My Hero Academia",
    author: "Kohei Horikoshi",
    chapters: 428,
    status: "Publishing",
    rating: 8.3,
  },
  {
    id: 4,
    title: "Attack on Titan",
    author: "Hajime Isayama",
    chapters: 139,
    status: "Completed",
    rating: 8.8,
  },
];

export default function MangaManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredManga = mangaList.filter(
    (manga) =>
      manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Author
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Chapters
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredManga.map((manga, index) => (
              <tr
                key={manga.id}
                className={`border-b border-border hover:bg-accent/50 transition ${
                  index % 2 === 0 ? "bg-card" : "bg-muted"
                }`}
              >
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {manga.title}
                </td>
                <td className="px-6 py-4 text-card-foreground">
                  {manga.author}
                </td>
                <td className="px-6 py-4 text-card-foreground">
                  {manga.chapters}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      manga.status === "Publishing"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {manga.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {manga.rating}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-accent transition text-card-foreground">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-destructive/10 transition text-destructive">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
