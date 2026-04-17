"use client";

import { useEffect, useMemo, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import { Eye, Pencil, X } from "lucide-react";

type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "ready_for_pickup"
  | "delivered"
  | "picked_up"
  | "cancelled"
  | "payment_failed";

type PaymentMethod = "mpesa" | "card" | "cod";
type FulfillmentMethod = "home_delivery" | "pickup";

type Order = {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: OrderStatus;
  payment: {
    method: PaymentMethod;
    status: string;
  };
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };
  fulfillment?: {
    method: FulfillmentMethod;
  };
};

const LOCKED_STATUSES: OrderStatus[] = ["delivered", "picked_up", "cancelled"];

const HOME_DELIVERY_STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "payment_failed",
];

const PICKUP_STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "processing",
  "ready_for_pickup",
  "picked_up",
  "cancelled",
  "payment_failed",
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  ready_for_pickup: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  picked_up: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  payment_failed: "bg-rose-100 text-rose-700",
};

const PAYMENT_STYLES: Record<PaymentMethod, string> = {
  mpesa: "bg-green-100 text-green-700",
  card: "bg-purple-100 text-purple-700",
  cod: "bg-amber-100 text-amber-700",
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  mpesa: "M-Pesa",
  card: "Card",
  cod: "Pay on Delivery",
};

const FULFILLMENT_STYLES: Record<FulfillmentMethod, string> = {
  home_delivery: "bg-slate-100 text-slate-700",
  pickup: "bg-orange-100 text-orange-700",
};

const STATUS_PRIORITY: Record<OrderStatus, number> = {
  pending_payment: 0,
  payment_failed: 1,
  confirmed: 2,
  processing: 3,
  shipped: 4,
  ready_for_pickup: 5,
  delivered: 6,
  picked_up: 7,
  cancelled: 8,
};

const PAGE_SIZE = 10;

type TabKey =
  | "all"
  | "pending_payment"
  | "home_delivery"
  | "pickup"
  | "cod"
  | "online";

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isThisWeek(date: Date) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

function isThisMonth(date: Date) {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function formatStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function EditStatusModal({
  order,
  onClose,
  onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, status: OrderStatus) => Promise<void>;
}) {
  const [selected, setSelected] = useState<OrderStatus>(order.orderStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPickup = order.fulfillment?.method === "pickup";
  const availableStatuses = isPickup ? PICKUP_STATUSES : HOME_DELIVERY_STATUSES;

  async function handleSave() {
    if (selected === order.orderStatus) {
      onClose();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave(order._id, selected);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Order Status
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Order #{order.orderNumber} —{" "}
              <span className="font-medium">{order.customer.fullName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          {isPickup ? "Pickup order flow." : "Home delivery order flow."}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Select new status</p>
          <div className="grid grid-cols-2 gap-2">
            {availableStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setSelected(s)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium capitalize transition-all cursor-pointer ${
                  selected === s
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    s === "pending_payment"
                      ? "bg-yellow-400"
                      : s === "confirmed"
                        ? "bg-blue-400"
                        : s === "processing"
                          ? "bg-indigo-400"
                          : s === "shipped"
                            ? "bg-purple-400"
                            : s === "ready_for_pickup"
                              ? "bg-cyan-400"
                              : s === "delivered" || s === "picked_up"
                                ? "bg-green-400"
                                : "bg-red-400"
                  }`}
                />
                {formatStatusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    getAdminOrders()
      .then((res) => {
        const incoming = res?.data?.orders ?? [];
        setOrders(incoming);
      })
      .catch((err) => setError(err?.message ?? "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusSave(orderId: string, status: OrderStatus) {
    await updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o)),
    );
  }

  const stats = useMemo(
    () => ({
      pendingPayment: orders.filter((o) => o.orderStatus === "pending_payment")
        .length,
      processing: orders.filter((o) => o.orderStatus === "processing").length,
      delivery: orders.filter((o) => o.fulfillment?.method === "home_delivery")
        .length,
      pickup: orders.filter((o) => o.fulfillment?.method === "pickup").length,
    }),
    [orders],
  );

  const filtered = useMemo(() => {
    let data = [...orders];

    data.sort((a, b) => {
      const pa = STATUS_PRIORITY[a.orderStatus] ?? 99;
      const pb = STATUS_PRIORITY[b.orderStatus] ?? 99;
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (activeTab === "pending_payment") {
      data = data.filter((o) => o.orderStatus === "pending_payment");
    } else if (activeTab === "home_delivery") {
      data = data.filter((o) => o.fulfillment?.method === "home_delivery");
    } else if (activeTab === "pickup") {
      data = data.filter((o) => o.fulfillment?.method === "pickup");
    } else if (activeTab === "online") {
      data = data.filter((o) => o.payment.method !== "cod");
    } else if (activeTab === "cod") {
      data = data.filter((o) => o.payment.method === "cod");
    }

    const q = search.toLowerCase().trim();
    if (q) {
      data = data.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customer?.fullName?.toLowerCase().includes(q) ||
          o.customer?.phone?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q),
      );
    }

    if (statusFilter) {
      data = data.filter((o) => o.orderStatus === statusFilter);
    }

    if (dateFilter) {
      data = data.filter((o) => {
        const date = new Date(o.createdAt);
        if (dateFilter === "today") return isToday(date);
        if (dateFilter === "week") return isThisWeek(date);
        if (dateFilter === "month") return isThisMonth(date);
        return true;
      });
    }

    return data;
  }, [orders, activeTab, search, statusFilter, dateFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, statusFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All orders" },
    {
      key: "pending_payment",
      label: `Pending payment (${stats.pendingPayment})`,
    },
    { key: "home_delivery", label: `Home delivery (${stats.delivery})` },
    { key: "pickup", label: `Pickup (${stats.pickup})` },
    { key: "cod", label: "Pay on delivery" },
    { key: "online", label: "Online payments" },
  ];

  return (
    <>
      {editingOrder && (
        <EditStatusModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleStatusSave}
        />
      )}

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your customer orders
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Export Orders
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Pending Payment",
              value: stats.pendingPayment,
              color: "text-yellow-600",
            },
            {
              label: "Processing",
              value: stats.processing,
              color: "text-indigo-600",
            },
            {
              label: "Home Delivery",
              value: stats.delivery,
              color: "text-slate-600",
            },
            {
              label: "Pickup",
              value: stats.pickup,
              color: "text-orange-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {loading ? "—" : stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex gap-0 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by order ID, customer name, phone or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All statuses</option>
              <option value="pending_payment">Pending payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="ready_for_pickup">Ready for pickup</option>
              <option value="delivered">Delivered</option>
              <option value="picked_up">Picked up</option>
              <option value="payment_failed">Payment failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Mode",
                    "Date",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-medium text-gray-600 px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      Loading orders…
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-red-500 text-sm"
                    >
                      {error}
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => {
                    const isLocked = LOCKED_STATUSES.includes(
                      order.orderStatus,
                    );
                    const fulfillmentMethod =
                      order.fulfillment?.method ?? "home_delivery";

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {order.customer?.fullName || "Unknown customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customer?.phone || "—"}
                          </p>
                          {order.customer?.email && (
                            <p className="text-xs text-gray-400">
                              {order.customer.email}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              FULFILLMENT_STYLES[fulfillmentMethod]
                            }`}
                          >
                            {fulfillmentMethod === "pickup"
                              ? "Pickup"
                              : "Home delivery"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.items?.length}{" "}
                          {order.items?.length === 1 ? "item" : "items"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          KSh {order.total?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              PAYMENT_STYLES[order.payment?.method] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {PAYMENT_LABELS[order.payment?.method] ??
                              order.payment?.method}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                              STATUS_STYLES[order.orderStatus] ??
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {formatStatusLabel(order.orderStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                router.push(`/dashboard/orders/${order._id}`)
                              }
                              title="View details"
                              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              onClick={() =>
                                !isLocked && setEditingOrder(order)
                              }
                              title={
                                isLocked
                                  ? `Cannot edit — order is ${formatStatusLabel(order.orderStatus)}`
                                  : "Edit status"
                              }
                              className={`transition-colors ${
                                isLocked
                                  ? "text-gray-200 cursor-not-allowed"
                                  : "text-gray-400 hover:text-amber-500 cursor-pointer"
                              }`}
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} orders
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                {pageNumbers.map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-3 py-1 text-sm text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(Number(page))}
                      className={`px-3 py-1 rounded text-sm cursor-pointer ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
