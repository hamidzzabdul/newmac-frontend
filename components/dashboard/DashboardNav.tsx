"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { getAdminNotifications } from "@/lib/api/notifications";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  title: string;
  desc: string;
  createdAt: string;
  unread: boolean;
  type: "order" | "payment" | "failed" | "info";
  orderId?: string;
  orderNumber?: string;
}

function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const typeStyles: Record<string, string> = {
  order: "bg-blue-500",
  payment: "bg-green-500",
  failed: "bg-red-500",
  info: "bg-gray-400",
};

const DashboardNav = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const loadNotifications = async () => {
    try {
      setNotifLoading(true);
      const res = await getAdminNotifications(5);
      setNotifications(res.data?.notifications ?? []);
      setUnreadCount(res.data?.unreadCount ?? 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleNotifToggle = async () => {
    const next = !notifOpen;
    setNotifOpen(next);

    if (next) {
      await loadNotifications();
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(
        `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex-1 max-w-md">
          <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 hover:border-gray-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search orders, products, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400 cursor-text"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                ✕
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <Search className="w-5 h-5 text-gray-500" />
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={handleNotifToggle}
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer group"
            >
              <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                style={{
                  animation:
                    "dropdown-in 0.15s cubic-bezier(0.16,1,0.3,1) forwards",
                  width: "22rem",
                }}
              >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {notifLoading ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.orderId) {
                            router.push(`/dashboard/orders/${n.orderId}`);
                            setNotifOpen(false);
                          }
                        }}
                        className={`px-4 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          n.unread ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            n.unread ? typeStyles[n.type] : "bg-gray-200"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {n.desc}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 pt-0.5 whitespace-nowrap">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      router.push("/dashboard/notifications");
                      setNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl pl-2 pr-3 py-2 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">
                    {initials}
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {user?.fullName?.split(" ")[0] ?? "Admin"}
                </p>
                <p className="text-xs text-gray-400 leading-tight capitalize">
                  {user?.role ?? "admin"}
                </p>
              </div>
              <ChevronDown
                className={`hidden lg:block w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                style={{
                  animation:
                    "dropdown-in 0.15s cubic-bezier(0.16,1,0.3,1) forwards",
                }}
              >
                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-bold">
                        {initials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.fullName ?? "Admin User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  {[
                    {
                      icon: LayoutDashboard,
                      label: "Dashboard",
                      href: "/dashboard",
                    },
                    { icon: User, label: "My Profile", href: "/profile" },
                    {
                      icon: Settings,
                      label: "Settings",
                      href: "/dashboard/settings",
                    },
                  ].map(({ icon: Icon, label, href }) => (
                    <button
                      key={label}
                      onClick={() => {
                        router.push(href);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Icon className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                    </div>
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </nav>
  );
};

export default DashboardNav;
