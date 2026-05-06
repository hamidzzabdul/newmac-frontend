"use client";

import DashboardNav from "@/components/dashboard/DashboardNav";
import Menu from "@/components/dashboard/Menu.";
import Link from "next/link";
import "@/app/globals.css";
import { Providers } from "@/services/QueryProvider";
import { Toaster } from "react-hot-toast";

import { useAuth } from "@/hooks/UseAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isCashier = user?.role === "cashier";
  const canAccessDashboard = isAdmin || isCashier;

  useEffect(() => {
    if (loading) return;

    if (!canAccessDashboard) {
      router.replace("/");
      return;
    }

    if (isCashier && pathname !== "/dashboard/orders") {
      router.replace("/dashboard/orders");
    }
  }, [loading, canAccessDashboard, isCashier, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!canAccessDashboard) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[#F7F8FA]">
      <Toaster />

      <aside className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link
            href={isCashier ? "/orders" : "/"}
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

        <div className="flex-1 overflow-y-auto pl-3">
          {isCashier ? (
            <div className="pt-4 pr-3">
              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
              >
                Orders
              </Link>
            </div>
          ) : (
            <Menu />
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardNav />
        <div className="flex-1 overflow-y-auto">
          <Providers>{children}</Providers>
        </div>
      </main>
    </div>
  );
}
