import DashboardNav from "@/components/dashboard/DashboardNav";
import Menu from "@/components/dashboard/Menu.";
import Link from "next/link";
import "@/app/globals.css";
import { auth } from "@clerk/nextjs/server";
import { Providers } from "@/services/QueryProvider";
import { Toaster } from "react-hot-toast";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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

            {/* Menu */}
            <div className="flex-1 overflow-y-auto pl-3">
              <Menu />
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    admin@newmark.com
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <DashboardNav />

            <div className="flex-1 overflow-y-auto">
              <Providers>{children}</Providers>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
