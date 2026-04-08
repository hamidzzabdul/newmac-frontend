"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  Camera,
  Package,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";

const ProfilePage = () => {
  const { user, login, logout, loading } = useAuth();
  console.log(user);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // ✅ Sync form once user loads from localStorage
  useEffect(() => {
    if (user) {
      setEditedProfile({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        password: "",
      });
    }
  }, [user]);

  // ✅ Loading guard AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("auth_token");
      const body: Record<string, string> = {
        name: editedProfile.fullName,
        email: editedProfile.email,
      };
      if (editedProfile.password) body.password = editedProfile.password;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }

      // Sync auth context + localStorage
      login({
        ...user!,
        fullName: editedProfile.fullName,
        email: editedProfile.email,
      });

      setSuccess(true);
      setIsEditing(false);
      setEditedProfile((prev) => ({ ...prev, password: "" }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      password: "",
    });
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          <div className="h-32 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-xl">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.fullName ?? "—"}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="font-bold text-gray-900 capitalize">
                    {user?.role}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Account</div>
                  <div className="font-bold text-gray-900">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {success && (
            <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
              ✅ Profile updated successfully
            </div>
          )}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.fullName}
                  onChange={(e) =>
                    setEditedProfile((p) => ({
                      ...p,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  {user?.fullName ?? "—"}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {user?.email}
                </div>
              )}
            </div>

            {/* Password */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password{" "}
                  <span className="font-normal text-gray-400">
                    (leave blank to keep current)
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editedProfile.password}
                    onChange={(e) =>
                      setEditedProfile((p) => ({
                        ...p,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
