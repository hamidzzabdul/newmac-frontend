"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";
import Menu from "@/components/dashboard/Menu.";
import Link from "next/link";
import "@/app/globals.css";
import { Providers } from "@/services/QueryProvider";
import { Toaster } from "react-hot-toast";

import { useAuth } from "@/hooks/UseAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

// Generates initials from a full name e.g. "James Mwangi" → "JM"
function getInitials(fullName: string) {
  return fullName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const initials = user?.fullName ? getInitials(user.fullName) : "A";

  return (
    <div className="h-screen flex overflow-hidden bg-[#F7F8FA]">
      <Toaster />

      {/* Sidebar */}
      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2 group"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="hidden lg:block font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              NewMark
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto pl-3">
          <Menu />
        </div>

        {/* Profile + logout */}
        <div className="p-4 border-t border-gray-200">
          {/* Collapsed view (small screens): just initials avatar */}
          <div className="flex lg:hidden justify-center">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
          </div>

          {/* Expanded view (large screens): full name, email, logout */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Avatar with initials */}
            <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName ?? "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email ?? ""}
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Logout button for collapsed sidebar (small/md screens) */}
          <div className="flex lg:hidden justify-center mt-3">
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNav />

        <div className="flex-1 overflow-y-auto">
          <Providers>{children}</Providers>
        </div>
      </main>
    </div>
  );
}
