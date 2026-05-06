"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Shield,
  Loader2,
  Search,
  Users,
  Lock,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllUsers, updateUserRole, updateMyPassword } from "@/lib/api/users";

const TABS = [
  { key: "general", label: "General" },
  { key: "users", label: "User Management" },
] as const;

const ROLES = [
  { value: "user", label: "Customer" },
  { value: "worker", label: "Worker" },
  { value: "cashier", label: "Cashier" },
  { value: "admin", label: "Admin" },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type Role = "user" | "worker" | "cashier" | "admin";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified?: boolean;
  createdAt?: string;
}

function parseApiError(err: any, fallback = "Something went wrong") {
  try {
    if (typeof err?.message === "string" && err.message.includes("{")) {
      return JSON.parse(err.message)?.message || fallback;
    }
    return err?.message || fallback;
  } catch {
    return err?.message || fallback;
  }
}

function getRoleBadge(role: Role) {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "worker":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "cashier":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  // General tab
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [initialProfile, setInitialProfile] = useState({
    name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Users tab
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const hasProfileChanges =
    profile.name.trim() !== initialProfile.name.trim() ||
    profile.email.trim().toLowerCase() !==
      initialProfile.email.trim().toLowerCase();

  // Pull current logged-in user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (!raw) return;

      const user = JSON.parse(raw);
      const loadedProfile = {
        name: user?.name || user?.fullName || "",
        email: user?.email || "",
      };

      setProfile(loadedProfile);
      setInitialProfile(loadedProfile);
    } catch {
      // ignore
    }
  }, []);

  const fetchUsers = async (currentPage = page, currentSearch = searchTerm) => {
    try {
      setLoadingUsers(true);

      const res = await getAllUsers({
        page: currentPage,
        limit,
        search: currentSearch,
      });

      const fetchedUsers = res?.docs || [];
      const pagination = res?.pagination || {};

      setUsers(fetchedUsers);
      setPage(pagination.page || currentPage);
      setTotalPages(pagination.totalPages || 1);
      setTotalUsers(pagination.total || fetchedUsers.length || 0);
    } catch (err: any) {
      toast.error(parseApiError(err, "Failed to load users"));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(page, searchTerm);
    }
  }, [activeTab, page, searchTerm]);

  const handleSearch = async () => {
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleSaveProfile = async () => {
    if (!hasProfileChanges) {
      toast("No changes to save");
      return;
    }

    try {
      setSavingProfile(true);

      const raw = localStorage.getItem("auth_user");
      const user = raw ? JSON.parse(raw) : {};

      const updatedUser = {
        ...user,
        name: profile.name.trim(),
        fullName: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
      };

      localStorage.setItem("auth_user", JSON.stringify(updatedUser));

      setInitialProfile({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      toast.success("Profile updated successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err: any) {
      toast.error(parseApiError(err, "Failed to update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.passwordCurrent.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordForm.password.trim()) {
      toast.error("New password is required");
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.password !== passwordForm.passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSavingPassword(true);

      await updateMyPassword({
        passwordCurrent: passwordForm.passwordCurrent,
        password: passwordForm.password,
        passwordConfirm: passwordForm.passwordConfirm,
      });

      toast.success("Password updated successfully");
      toast.success("Profile updated successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
      setPasswordForm({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
    } catch (err: any) {
      toast.error(parseApiError(err, "Failed to update password"));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, role);
      toast.success("User role updated successfully");

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role } : user)),
      );
    } catch (err: any) {
      toast.error(parseApiError(err, "Failed to update role"));
      await fetchUsers(page, searchTerm);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const pageSummary = useMemo(() => {
    if (!users.length) return "No users found";
    const start = (page - 1) * limit + 1;
    const end = start + users.length - 1;
    return `Showing ${start}-${end} of ${totalUsers} users`;
  }, [page, limit, users.length, totalUsers]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage your account settings and team access
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-6xl">
        {/* General */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your basic account information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile || !hasProfileChanges}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update the password for the currently logged-in dashboard
                    user
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.passwordCurrent}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        passwordCurrent: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.passwordConfirm}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        passwordConfirm: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    placeholder="Re-enter new password"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={savingPassword}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      User Management
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Search users and update roles
                    </p>
                  </div>
                </div>

                <div className="flex w-full lg:w-auto gap-2">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder="Search by name, email or role..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">{pageSummary}</p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                      setPage(1);
                    }}
                    className="text-sm font-medium text-gray-600 hover:text-black underline underline-offset-2"
                  >
                    Clear search
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="py-3 pr-4 font-semibold text-gray-500">
                        Name
                      </th>
                      <th className="py-3 pr-4 font-semibold text-gray-500">
                        Email
                      </th>
                      <th className="py-3 pr-4 font-semibold text-gray-500">
                        Role
                      </th>
                      <th className="py-3 pr-4 font-semibold text-gray-500">
                        Verified
                      </th>
                      <th className="py-3 pr-4 font-semibold text-gray-500">
                        Created
                      </th>
                      <th className="py-3 font-semibold text-gray-500">
                        Change Role
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center">
                          <div className="inline-flex items-center gap-2 text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-50 last:border-b-0"
                        >
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-gray-900">
                              {user.name}
                            </div>
                          </td>

                          <td className="py-4 pr-4 text-gray-600">
                            {user.email}
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-gray-600">
                            {user.isVerified ? "Yes" : "No"}
                          </td>

                          <td className="py-4 pr-4 text-gray-600">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="py-4">
                            <select
                              value={user.role}
                              disabled={updatingUserId === user._id}
                              onChange={(e) =>
                                handleRoleChange(
                                  user._id,
                                  e.target.value as Role,
                                )
                              }
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black disabled:opacity-50"
                            >
                              {ROLES.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => page > 1 && setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      page < totalPages && setPage((prev) => prev + 1)
                    }
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm font-semibold text-blue-800">
                Role management
              </p>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Admins can update each user's role directly from the table.
                Changes are applied immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
