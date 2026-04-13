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
