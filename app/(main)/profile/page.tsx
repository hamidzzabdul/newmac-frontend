"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  Edit2,
  Save,
  X,
  ShieldCheck,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  BadgeCheck,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useLogoutAndRedirect } from "@/hooks/useLogoutAndRedirect";

const ProfilePage = () => {
  const { login } = useAuth();
  const { user, loading, isBlocked } = useProtectedPage({
    redirectTo: "/",
    hardRedirect: true,
  });

  const { logoutAndRedirect } = useLogoutAndRedirect({
    redirectTo: "/",
    message: "Signing you out...",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setEditedProfile({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
      });
    }
  }, [user]);

  const initials = useMemo(() => {
    const name = user?.fullName?.trim() || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }, [user?.fullName]);

  const showTimedMessage = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setSuccess(null);
    }
  };

  const resetProfileForm = () => {
    setEditedProfile({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
    });
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: editedProfile.fullName,
            email: editedProfile.email,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      login({
        ...user!,
        fullName: editedProfile.fullName,
        email: editedProfile.email,
      });

      setIsEditingProfile(false);
      showTimedMessage("success", "Profile updated successfully");
    } catch (err: any) {
      showTimedMessage("error", err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setSavingPassword(true);
      setError(null);
      setSuccess(null);

      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        throw new Error("Please fill in all password fields");
      }

      if (passwordForm.newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      const token = localStorage.getItem("auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateMyPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            passwordCurrent: passwordForm.currentPassword,
            password: passwordForm.newPassword,
            passwordConfirm: passwordForm.confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      if (data.token && user) {
        login({
          ...user,
          token: data.token,
        });
      }

      resetPasswordForm();
      setIsChangingPassword(false);
      showTimedMessage("success", "Password updated successfully");
    } catch (err: any) {
      showTimedMessage("error", err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelProfile = () => {
    resetProfileForm();
    setIsEditingProfile(false);
    setError(null);
  };

  const handleCancelPassword = () => {
    resetPasswordForm();
    setIsChangingPassword(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isBlocked) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-6">
          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <div className="h-32 md:h-40 bg-linear-to-r from-red-600 via-red-500 to-rose-400" />

            <div className="px-6 md:px-8 pb-8">
              <div className="-mt-14 md:-mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-red-600">
                    {initials}
                  </div>

                  <div className="pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {user?.fullName ?? "User"}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Active
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setIsEditingProfile(true);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}

                  <button
                    onClick={logoutAndRedirect}
                    className="px-5 py-2.5 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {user?.role === "admin" && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-bold text-gray-900 capitalize">Admin</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500">Email Status</p>
                  <p className="font-bold text-gray-900">Verified Account</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-bold text-gray-900">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {success && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium">
              {success}
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Keep your account details up to date.
                  </p>
                </div>

                {isEditingProfile && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancelProfile}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {savingProfile ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editedProfile.fullName}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium flex items-center gap-3 border border-gray-100">
                      <User className="w-5 h-5 text-gray-400" />
                      {user?.fullName ?? "—"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium flex items-center gap-3 border border-gray-100">
                      <Mail className="w-5 h-5 text-gray-400" />
                      {user?.email ?? "—"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Security</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Change your password securely.
                  </p>
                </div>

                {!isChangingPassword && (
                  <button
                    onClick={() => {
                      setIsChangingPassword(true);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleCancelPassword}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>

                    <button
                      onClick={handleUpdatePassword}
                      disabled={savingPassword}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {savingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Password protection
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Keep your account secure by updating your password
                        regularly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
