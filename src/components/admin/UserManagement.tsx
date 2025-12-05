import { userService } from "@/services/user.service";
import type { UserListResponse } from "@/types/api";
import { Users, Trash2, Ban, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState<UserListResponse>({
    users: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, total: 0 },
  });

  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUserList = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsers({
        page: 1,
        limit: 10,
      });
      console.log(response);

      if (response) {
        setUserList(response);
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const filteredUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getUsers({
        page: 1,
        limit: 10,
        search: searchTerm,
      });
      if (response) {
        setUserList(response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    filteredUsers();
  }, [searchTerm]);

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

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div> */}

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loadingUsers ? (
        <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                {["Avatar", "User", "Email", "Role", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-sm font-semibold text-card-foreground"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {[...Array(5)].map((_, i) => (
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-card-foreground">
                  Avatar
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  User
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Joined
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-card-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userList.users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b border-border hover:bg-accent/50 transition ${
                    index % 2 === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <td className="px-6 py-4 text-card-foreground font-medium">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={`${user.username}'s avatar`}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <Users className="w-12 h-12 text-muted-foreground" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : user.role === "uploader"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-card-foreground text-sm text-center">
                    {user.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 transition text-yellow-600 dark:text-yellow-400">
                        <Ban size={18} />
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
