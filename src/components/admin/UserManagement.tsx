import { Users, Shield, Trash2, Ban } from "lucide-react";

const userList = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    status: "Active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "Moderator",
    status: "Active",
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john@example.com",
    role: "Translator",
    status: "Active",
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Lisa Wong",
    email: "lisa@example.com",
    role: "User",
    status: "Inactive",
    joinDate: "2024-01-05",
  },
];

export default function UserManagement() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          User Management
        </h2>
        <p className="text-muted-foreground">
          Monitor and manage user accounts and permissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Users</p>
            <p className="text-2xl font-bold text-card-foreground">12,345</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Users className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active This Month</p>
            <p className="text-2xl font-bold text-card-foreground">8,456</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Shield className="text-red-600 dark:text-red-400" size={24} />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Moderators</p>
            <p className="text-2xl font-bold text-card-foreground">24</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-border hover:bg-accent/50 transition ${
                  index % 2 === 0 ? "bg-card" : "bg-muted"
                }`}
              >
                <td className="px-6 py-4 text-card-foreground font-medium">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-card-foreground text-sm">
                  {user.joinDate}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 transition text-yellow-600 dark:text-yellow-400">
                    <Ban size={18} />
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
