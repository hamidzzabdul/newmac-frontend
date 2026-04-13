"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Info,
  RefreshCw,
  CheckCheck,
  Filter,
} from "lucide-react";
import { getAdminOrders } from "@/lib/api/orders";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  payment: { status: string; method: string };
  total: number;
  items: { name: string }[];
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  fullTime: string;
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

function fullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ordersToNotifications(orders: Order[]): Notification[] {
  const notifs: Notification[] = [];

  orders.forEach((order) => {
    notifs.push({
      id: `order-${order._id}`,
      title: "New order received",
      desc: `${order.orderNumber} · KSh ${order.total.toLocaleString()} · ${order.items[0]?.name ?? ""}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`,
      time: timeAgo(order.createdAt),
      fullTime: fullDate(order.createdAt),
      unread: order.orderStatus === "pending",
      type: "order",
      orderId: order._id,
      orderNumber: order.orderNumber,
    });

    if (order.payment.status === "paid") {
      notifs.push({
        id: `pay-${order._id}`,
        title: "Payment confirmed",
        desc: `${order.payment.method === "mpesa" ? "M-Pesa" : order.payment.method === "card" ? "Card" : "Cash on Delivery"} payment of KSh ${order.total.toLocaleString()} received for ${order.orderNumber}`,
        time: timeAgo(order.createdAt),
        fullTime: fullDate(order.createdAt),
        unread: false,
        type: "payment",
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    }

    if (order.payment.status === "failed") {
      notifs.push({
        id: `fail-${order._id}`,
        title: "Payment failed",
        desc: `Payment for ${order.orderNumber} was not completed. Customer may need to retry.`,
        time: timeAgo(order.createdAt),
        fullTime: fullDate(order.createdAt),
        unread: true,
        type: "failed",
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    }

    if (order.orderStatus === "shipped") {
      notifs.push({
        id: `ship-${order._id}`,
        title: "Order shipped",
        desc: `${order.orderNumber} has been dispatched and is on its way to the customer`,
        time: timeAgo(order.createdAt),
        fullTime: fullDate(order.createdAt),
        unread: false,
        type: "info",
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    }
  });

  return notifs.sort((a, b) => Number(b.unread) - Number(a.unread));
}

const TYPE_CONFIG = {
  order: {
    icon: ShoppingBag,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Order",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-green-100",
    iconColor: "text-green-600",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200",
    label: "Payment",
  },
  failed: {
    icon: AlertTriangle,
    bg: "bg-red-100",
    iconColor: "text-red-600",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    label: "Failed",
  },
  info: {
    icon: Info,
    bg: "bg-gray-100",
    iconColor: "text-gray-600",
    dot: "bg-gray-400",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    label: "Info",
  },
};

const FILTERS = ["all", "order", "payment", "failed", "info"] as const;
type FilterType = (typeof FILTERS)[number];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrders();
      const orders: Order[] = res.data?.orders ?? res.orders ?? [];
      setNotifications(ordersToNotifications(orders));
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const isUnread = (n: Notification) => n.unread && !readIds.has(n.id);

  const filtered = notifications.filter((n) =>
    filter === "all" ? true : n.type === filter,
  );

  const unreadCount = notifications.filter(isUnread).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 border border-gray-200">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold mb-4">{error}</p>
          <button
            onClick={load}
            className="px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
              <Bell className="w-6 h-6" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm font-bold px-2.5 py-0.5 bg-red-100 text-red-600 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {notifications.length} total activity events from your orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all cursor-pointer group"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {FILTERS.map((f) => {
            const count =
              f === "all"
                ? notifications.length
                : notifications.filter((n) => n.type === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === f
                    ? "bg-black text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    filter === f
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No notifications in this category
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              const unread = isUnread(n);

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    markRead(n.id);
                    if (n.orderNumber)
                      router.push(`/dashboard/orders/${n.orderId}`);
                  }}
                  className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    unread
                      ? "bg-white border-gray-200 shadow-sm hover:shadow-md"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-sm font-bold ${unread ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {n.title}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}
                          >
                            {cfg.label}
                          </span>
                          {unread && (
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {n.time}
                        </p>
                        <p className="text-xs text-gray-300 whitespace-nowrap mt-0.5 hidden group-hover:block">
                          {n.fullTime}
                        </p>
                      </div>
                    </div>

                    {n.orderNumber && (
                      <p className="text-xs text-gray-400 mt-1.5 font-mono">
                        {n.orderNumber}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
