import { Clock, CheckCircle, AlertCircle, Play } from "lucide-react";

const translationQueue = [
  {
    id: 1,
    mangaTitle: "Jujutsu Kaisen",
    chapter: "Chapter 247",
    language: "Spanish",
    translator: "Carlos Rodriguez",
    progress: 85,
    status: "In Progress",
  },
  {
    id: 2,
    mangaTitle: "Chainsawman",
    chapter: "Chapter 168",
    language: "French",
    translator: "Marie Dubois",
    progress: 100,
    status: "Review",
  },
  {
    id: 3,
    mangaTitle: "My Hero Academia",
    chapter: "Chapter 428",
    language: "German",
    translator: "Klaus Mueller",
    progress: 45,
    status: "In Progress",
  },
  {
    id: 4,
    mangaTitle: "Attack on Titan",
    chapter: "Chapter 140",
    language: "Portuguese",
    translator: "João Silva",
    progress: 0,
    status: "Pending",
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

export default function TranslationQueue() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Translation Queue
        </h2>
        <p className="text-muted-foreground">
          Track ongoing translation projects and assignments
        </p>
      </div>

      <div className="space-y-4">
        {translationQueue.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">
                  {item.mangaTitle} - {item.chapter}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Translator:{" "}
                  <span className="font-medium text-card-foreground">
                    {item.translator}
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-card-foreground">
                    {item.language}
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
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-medium text-card-foreground">
                  {item.progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
