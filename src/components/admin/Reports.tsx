import { useState } from "react";
import {
  Trash2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";

const reportsList = [
  {
    id: 1,
    reportedBy: "user_123",
    contentType: "Manga",
    contentTitle: "Jujutsu Kaisen",
    reason: "Inappropriate content",
    description: "Contains explicit material",
    status: "Pending",
    date: "2024-11-12",
    priority: "High",
  },
  {
    id: 2,
    reportedBy: "user_456",
    contentType: "Comment",
    contentTitle: "Chapter 200 Discussion",
    reason: "Spam/Harassment",
    description: "Repeated spam comments",
    status: "Resolved",
    date: "2024-11-10",
    priority: "Medium",
  },
  {
    id: 3,
    reportedBy: "user_789",
    contentType: "User",
    contentTitle: "translator_pro",
    reason: "Suspicious activity",
    description: "Multiple account violations",
    status: "In Review",
    date: "2024-11-11",
    priority: "High",
  },
  {
    id: 4,
    reportedBy: "user_012",
    contentType: "Translation",
    contentTitle: "Chainsaw Man Ch. 50",
    reason: "Poor quality",
    description: "Machine translation detected",
    status: "Pending",
    date: "2024-11-09",
    priority: "Low",
  },
  {
    id: 5,
    reportedBy: "user_345",
    contentType: "Manga",
    contentTitle: "Attack on Titan",
    reason: "Duplicate upload",
    description: "Already exists in database",
    status: "Resolved",
    date: "2024-11-08",
    priority: "Low",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="text-green-600" size={18} />;
    case "In Review":
      return <Clock className="text-yellow-600" size={18} />;
    case "Pending":
      return <AlertCircle className="text-red-600" size={18} />;
    default:
      return <AlertCircle size={18} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "In Review":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Pending":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "text-red-600 dark:text-red-400";
    case "Medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "Low":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-gray-600";
  }
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredReports = reportsList.filter((report) => {
    const matchesSearch =
      report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: reportsList.filter((r) => r.status === "Pending").length,
    inReview: reportsList.filter((r) => r.status === "In Review").length,
    resolved: reportsList.filter((r) => r.status === "Resolved").length,
    total: reportsList.length,
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          User Reports & Moderation
        </h2>
        <p className="text-muted-foreground">
          Review and manage user reports, spam, and content violations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.pending}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">In Review</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.inReview}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.resolved}
          </p>
        </div>
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
            placeholder="Search by title, user, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Review</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Content Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Content Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Reported By
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Reason
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr
                key={report.id}
                className={`border-b border-border hover:bg-accent/50 transition ${
                  index % 2 === 0 ? "bg-card" : "bg-muted"
                }`}
              >
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {report.contentType}
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {report.contentTitle}
                </td>
                <td className="px-6 py-4 text-card-foreground">
                  {report.reportedBy}
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {report.reason}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${getPriorityColor(
                    report.priority
                  )}`}
                >
                  {report.priority}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {report.date}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-accent transition text-card-foreground"
                    title="View Details"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-destructive/10 transition text-destructive"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <AlertCircle
            className="mx-auto mb-4 text-muted-foreground"
            size={40}
          />
          <p className="text-muted-foreground">
            No reports found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
