"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, PackageCheck, ClipboardList } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/services/QueryProvider";
import { useAuth } from "@/hooks/UseAuth";
import "@/app/globals.css";

export default function WorkerLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const canAccessWorkerPortal =
    user?.role === "worker" || user?.role === "admin";

  useEffect(() => {
    if (!loading && !canAccessWorkerPortal) {
      router.replace("/");
    }
  }, [loading, canAccessWorkerPortal, router]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F7F8FA]">
        <p className="text-sm text-gray-500">Loading worker portal...</p>
      </div>
    );
  }

  if (!canAccessWorkerPortal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Toaster />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/butcher/orders" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-sm font-bold text-gray-900">
                Newmark Worker Portal
              </h1>
              <p className="text-xs text-gray-400">
                Order preparation dashboard
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4">
        <nav className="bg-white border border-gray-200 rounded-2xl p-2 flex gap-2">
          <Link
            href="/butcher/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold"
          >
            <ClipboardList className="w-4 h-4" />
            Orders
          </Link>
        </nav>
      </div>

      <main className="flex-1">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}
