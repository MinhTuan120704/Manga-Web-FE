import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TranslationItem {
  id: number;
  mangaTitle: string;
  chapter: string;
  language: string;
  translator: string;
  progress: number;
  status: string;
  totalChapters?: number;
  translatedChapters?: number;
  isHot?: boolean;
  hasUpcomingAnime?: boolean;
}

const translationQueue: TranslationItem[] = [
  {
    id: 1,
    mangaTitle: "Jujutsu Kaisen",
    chapter: "247",
    language: "Spanish",
    translator: "Carlos Rodriguez",
    progress: 85,
    status: "In Progress",
    totalChapters: 260,
    translatedChapters: 220,
    isHot: true,
    hasUpcomingAnime: false,
  },
  {
    id: 2,
    mangaTitle: "Chainsawman",
    chapter: "168",
    language: "French",
    translator: "Marie Dubois",
    progress: 100,
    status: "Review",
    totalChapters: 168,
    translatedChapters: 168,
    isHot: true,
    hasUpcomingAnime: false,
  },
  {
    id: 3,
    mangaTitle: "My Hero Academia",
    chapter: "428",
    language: "German",
    translator: "Klaus Mueller",
    progress: 45,
    status: "In Progress",
    totalChapters: 430,
    translatedChapters: 190,
    isHot: true,
    hasUpcomingAnime: true,
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "In Progress":
      return <Clock className="text-yellow-600" size={20} />;
    case "Review":
      return <AlertCircle className="text-blue-600" size={20} />;
    case "Pending":
      return <Play className="text-gray-600" size={20} />;
    default:
      return <CheckCircle className="text-green-600" size={20} />;
  }
}

function getStatusInVietnamese(status: string): string {
  switch (status) {
    case "In Progress":
      return "Đang tiến hành";
    case "Review":
      return "Đang xem xét";
    case "Pending":
      return "Chờ xử lý";
    case "Completed":
      return "Hoàn thành";
    default:
      return status;
  }
}

function getLanguageInVietnamese(language: string): string {
  switch (language) {
    case "Spanish":
      return "Tiếng Tây Ban Nha";
    case "French":
      return "Tiếng Pháp";
    case "German":
      return "Tiếng Đức";
    case "Portuguese":
      return "Tiếng Bồ Đào Nha";
    case "English":
      return "Tiếng Anh";
    case "Japanese":
      return "Tiếng Nhật";
    case "Korean":
      return "Tiếng Hàn";
    case "Chinese":
      return "Tiếng Trung";
    case "Italian":
      return "Tiếng Ý";
    case "Russian":
      return "Tiếng Nga";
    case "Thai":
      return "Tiếng Thái";
    case "Vietnamese":
      return "Tiếng Việt";
    default:
      return language;
  }
}

export default function TranslationQueue() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLanguage, setFilterLanguage] = useState("All");
  const [progressFilterType, setProgressFilterType] = useState<
    "all" | "missing" | "percent"
  >("all");
  const [minMissingChapters, setMinMissingChapters] = useState<number>(1);
  const [maxTranslatedPercent, setMaxTranslatedPercent] = useState<number>(80);
  const [filterHot, setFilterHot] = useState<boolean>(false);
  const [filterUpcoming, setFilterUpcoming] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredQueue = translationQueue.filter((item) => {
    const total = item.totalChapters ?? 0;
    const translated = item.translatedChapters ?? 0;
    const missing = Math.max(0, total - translated);
    const percentTranslated =
      total > 0 ? Math.round((translated / total) * 100) : item.progress ?? 0;
    const isHotItem = Boolean(item.isHot);
    const hasUpcoming = Boolean(item.hasUpcomingAnime);

    const matchesSearch =
      item.mangaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.translator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    const matchesLanguage =
      filterLanguage === "All" || item.language === filterLanguage;

    // Progress filter: by missing chapters or by percent translated
    let matchesProgress = true;
    if (progressFilterType === "missing") {
      matchesProgress = missing >= minMissingChapters;
    } else if (progressFilterType === "percent") {
      matchesProgress = percentTranslated <= maxTranslatedPercent;
    }

    // Hot / Upcoming filters
    const matchesHot = !filterHot || isHotItem;
    const matchesUpcoming = !filterUpcoming || hasUpcoming;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesLanguage &&
      matchesProgress &&
      matchesHot &&
      matchesUpcoming
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQueue = filteredQueue.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleLanguageChange = (value: string) => {
    setFilterLanguage(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Hàng đợi dịch thuật
        </h2>
        <p className="text-muted-foreground">
          Theo dõi các dự án dịch thuật và phân công đang diễn ra
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên manga, chương hoặc dịch giả..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Pending">Chờ xử lý</option>
            <option value="In Progress">Đang tiến hành</option>
            <option value="Review">Đang xem xét</option>
            <option value="Completed">Hoàn thành</option>
          </select>
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">Tất cả ngôn ngữ</option>
            <option value="Spanish">Tiếng Tây Ban Nha</option>
            <option value="French">Tiếng Pháp</option>
            <option value="German">Tiếng Đức</option>
            <option value="Portuguese">Tiếng Bồ Đào Nha</option>
            <option value="English">Tiếng Anh</option>
            <option value="Japanese">Tiếng Nhật</option>
            <option value="Korean">Tiếng Hàn</option>
            <option value="Chinese">Tiếng Trung</option>
            <option value="Vietnamese">Tiếng Việt</option>
          </select>
        </div>
        {/* Progress & Priority Filters */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Tiến độ:</label>
          <select
            value={progressFilterType}
            onChange={(e) => {
              setProgressFilterType(
                e.target.value as "all" | "missing" | "percent"
              );
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tất cả</option>
            <option value="missing">Theo số chương thiếu (&gt;=)</option>
            <option value="percent">Theo % đã dịch (&lt;=)</option>
          </select>

          {progressFilterType === "missing" && (
            <input
              type="number"
              min={1}
              value={minMissingChapters}
              onChange={(e) => {
                setMinMissingChapters(Number(e.target.value || 0));
                setCurrentPage(1);
              }}
              className="w-20 px-3 py-2 rounded-lg border border-border bg-card text-card-foreground"
            />
          )}

          {progressFilterType === "percent" && (
            <input
              type="number"
              min={0}
              max={100}
              value={maxTranslatedPercent}
              onChange={(e) => {
                setMaxTranslatedPercent(Number(e.target.value || 0));
                setCurrentPage(1);
              }}
              className="w-20 px-3 py-2 rounded-lg border border-border bg-card text-card-foreground"
            />
          )}
        </div>

        {/* Hot / Upcoming toggles */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterHot}
              onChange={(e) => {
                setFilterHot(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded"
            />
            <span className="text-muted-foreground">Hot</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterUpcoming}
              onChange={(e) => {
                setFilterUpcoming(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded"
            />
            <span className="text-muted-foreground">Sắp có anime</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedQueue.length > 0 ? (
          paginatedQueue.map((item) => {
            const total = item.totalChapters ?? 0;
            const translated = item.translatedChapters ?? 0;
            const missing = Math.max(0, total - translated);
            const percentTranslated =
              total > 0
                ? Math.round((translated / total) * 100)
                : item.progress || 0;
            const isHotItem = Boolean(item.isHot);
            const hasUpcoming = Boolean(item.hasUpcomingAnime);
            const urgent =
              missing >= 5 ||
              (isHotItem && missing > 0) ||
              (hasUpcoming && missing > 0);

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1 flex items-center gap-2">
                      <span>
                        {item.mangaTitle} - Chương {item.chapter}
                      </span>
                      {urgent && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                          Ưu tiên
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Dịch giả:{" "}
                      <span className="font-medium text-card-foreground">
                        {item.translator}
                      </span>
                    </p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-card-foreground">
                        {getLanguageInVietnamese(item.language)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          item.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : item.status === "Review"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : item.status === "Pending"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {getStatusInVietnamese(item.status)}
                      </span>
                    </div>

                    {/* Missing / Percent summary */}
                    <div className="text-sm text-muted-foreground">
                      {total > 0 ? (
                        <>
                          Thiếu:{" "}
                          <span className="font-medium text-card-foreground">
                            {missing}
                          </span>{" "}
                          chương • Đã dịch:{" "}
                          <span className="font-medium text-card-foreground">
                            {percentTranslated}%
                          </span>
                          {isHotItem && (
                            <span className="ml-3 text-xs text-yellow-400">
                              • Hot
                            </span>
                          )}
                          {hasUpcoming && (
                            <span className="ml-2 text-xs text-blue-400">
                              • Sắp có anime
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          Đã dịch:{" "}
                          <span className="font-medium text-card-foreground">
                            {item.progress}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">
                      Hoàn thành
                    </span>
                    <span className="text-xs font-medium text-card-foreground">
                      {percentTranslated}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentTranslated}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Clock className="mx-auto mb-4 text-muted-foreground" size={40} />
            <p className="text-muted-foreground">
              Không tìm thấy dự án dịch thuật nào phù hợp với tiêu chí của bạn
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredQueue.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1} đến{" "}
            {Math.min(endIndex, filteredQueue.length)} trong tổng số{" "}
            {filteredQueue.length} dự án dịch thuật
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsisBefore && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg border transition ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border bg-card text-card-foreground hover:bg-accent"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
