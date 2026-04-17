"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardActions from "../components/DashboardActions";
import { getAdminOrders } from "@/lib/api/orders";

type OrderItem = {
  product?: {
    _id?: string;
    name?: string;
    price?: number;
    image?: string;
  };
  name?: string;
  price?: number;
  qty?: number;
  quantity?: number;
};

type Order = {
  _id: string;
  orderNumber?: string;
  customerName?: string;
  phone?: string;
  totalAmount?: number;
  total?: number;
  amount?: number;
  status?: string;
  orderStatus?: string;
  paymentStatus?: string;
  createdAt?: string;
  items?: OrderItem[];
  payment?: {
    method?: "mpesa" | "card" | "cod";
    status?: "pending" | "paid" | "failed" | "refunded";
    mpesaReceiptNumber?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    deliveryNotes?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
  };
  user?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCustomerName(order: Order) {
  if (order.customerName?.trim()) return order.customerName;

  const userFullName = [order.user?.firstName, order.user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (userFullName) return userFullName;
  if (order.user?.name?.trim()) return order.user.name;

  const shippingFullName = [
    order.shippingAddress?.firstName,
    order.shippingAddress?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (shippingFullName) return shippingFullName;
  if (order.shippingAddress?.name?.trim()) return order.shippingAddress.name;

  if (order.phone?.trim()) return order.phone;
  if (order.user?.phone?.trim()) return order.user.phone;
  if (order.shippingAddress?.phone?.trim()) return order.shippingAddress.phone;

  return "Guest Customer";
}

function getOrderAmount(order: Order) {
  return Number(order.totalAmount ?? order.total ?? order.amount ?? 0);
}

function getOrderProduct(order: Order) {
  if (!order.items || order.items.length === 0) return "No items";
  if (order.items.length === 1) {
    return (
      order.items[0].product?.name || order.items[0].name || "Unnamed product"
    );
  }
  return `${order.items.length} items`;
}

function getOrderStatus(order: Order) {
  return order.orderStatus || order.status || "unknown";
}

function getPaymentStatus(order: Order) {
  return order.payment?.status || order.paymentStatus || "unknown";
}

function getStatusClasses(status?: string) {
  const s = (status || "").toLowerCase();

  function getStatusClasses(status?: string) {
    const s = (status || "").toLowerCase().trim();

    if (["delivered", "confirmed", "completed"].includes(s)) {
      return "bg-green-100 text-green-700";
    }

    if (["processing", "pending"].includes(s)) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (["shipped", "in transit"].includes(s)) {
      return "bg-blue-100 text-blue-700";
    }

    if (["cancelled", "failed", "refunded"].includes(s)) {
      return "bg-red-100 text-red-700";
    }

    if (["paid"].includes(s)) {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  return "bg-gray-100 text-gray-700";
}

function formatDate(date?: string) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminOrders();

        const normalizedOrders: Order[] = Array.isArray(response)
          ? response
          : Array.isArray(response?.orders)
            ? response.orders
            : Array.isArray(response?.data)
              ? response.data
              : Array.isArray(response?.data?.orders)
                ? response.data.orders
                : [];

        setOrders(normalizedOrders);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const dashboard = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + getOrderAmount(order),
      0,
    );

    const totalOrders = orders.length;

    const deliveredOrders = orders.filter((o) =>
      ["delivered", "confirmed", "completed"].includes(
        getOrderStatus(o).toLowerCase(),
      ),
    ).length;

    const pendingOrders = orders.filter((o) =>
      ["pending", "processing"].includes(getOrderStatus(o).toLowerCase()),
    ).length;

    const cancelledOrders = orders.filter((o) =>
      ["cancelled", "failed"].includes(getOrderStatus(o).toLowerCase()),
    ).length;

    const paidOrders = orders.filter((o) =>
      ["paid", "completed", "success"].includes(
        getPaymentStatus(o).toLowerCase(),
      ),
    ).length;

    const uniqueCustomers = new Set(
      orders.map((o) => getCustomerName(o)).filter(Boolean),
    ).size;

    const averageOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const recentOrders = [...orders]
      .sort((a, b) => {
        const ad = new Date(a.createdAt || 0).getTime();
        const bd = new Date(b.createdAt || 0).getTime();
        return bd - ad;
      })
      .slice(0, 6);

    const latestOrder = recentOrders[0];

    const fulfillmentRate =
      totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

    const paymentRate =
      totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      paidOrders,
      uniqueCustomers,
      averageOrderValue,
      recentOrders,
      latestOrder,
      fulfillmentRate,
      paymentRate,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-rose-950 via-red-900 to-orange-800 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-white/80">{getGreeting()}</p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Dashboard Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
              Monitor store performance, track orders, and manage daily
              operations for your meat business from one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Link
              href="/dashboard/orders"
              className="cursor-pointer rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
            >
              View Orders
            </Link>
            <Link
              href="/dashboard/products"
              className="cursor-pointer rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
            >
              Manage Products
            </Link>
            <Link
              href="/dashboard/#"
              className="cursor-pointer rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
            >
              Customers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(dashboard.totalRevenue)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Revenue from all orders
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <svg
                className="h-6 w-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1a4.978 4.978 0 01-2.599-.73M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {dashboard.totalOrders}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                {dashboard.pendingOrders} still awaiting action
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2M5 8l1.4-3.2A2 2 0 018.24 3h7.52a2 2 0 011.84 1.2L19 8"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {dashboard.uniqueCustomers}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Unique buyers recorded
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-3-3h-2m0 5H7m10 0v-2c0-.7-.15-1.36-.42-1.96M7 20H2v-2a3 3 0 013-3h2m0 5v-2c0-.7.15-1.36.42-1.96m0 0A5 5 0 1116.58 16M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(dashboard.averageOrderValue)}
              </h3>
              <p className="mt-2 text-xs text-gray-500">
                Average spend per order
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 11V6a1 1 0 112 0v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <DashboardActions />

      {/* Middle layout */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Business summary */}
        <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Business Summary
              </h2>
              <p className="text-sm text-gray-500">
                Quick performance view of the store
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-sm text-green-700">Delivered Orders</p>
              <h3 className="mt-2 text-2xl font-bold text-green-900">
                {dashboard.deliveredOrders}
              </h3>
              <p className="mt-2 text-xs text-green-700">
                Fulfillment rate: {dashboard.fulfillmentRate}%
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700">Pending Orders</p>
              <h3 className="mt-2 text-2xl font-bold text-yellow-900">
                {dashboard.pendingOrders}
              </h3>
              <p className="mt-2 text-xs text-yellow-700">
                Orders needing follow-up
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Paid Orders</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-900">
                {dashboard.paidOrders}
              </h3>
              <p className="mt-2 text-xs text-blue-700">
                Payment success rate: {dashboard.paymentRate}%
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                Latest Order Activity
              </p>
              <h3 className="mt-2 text-base font-semibold text-gray-900">
                {dashboard.latestOrder
                  ? `#${dashboard.latestOrder.orderNumber || dashboard.latestOrder._id.slice(-6).toUpperCase()}`
                  : "No orders yet"}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {dashboard.latestOrder
                  ? `${getCustomerName(dashboard.latestOrder)} • ${formatCurrency(getOrderAmount(dashboard.latestOrder))}`
                  : "Once orders come in, the latest activity will show here."}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {dashboard.latestOrder
                  ? formatDate(dashboard.latestOrder.createdAt)
                  : "Waiting for activity"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">
                Store Focus Today
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Follow up pending orders quickly</li>
                <li>• Confirm deliveries for completed sales</li>
                <li>• Monitor payment completion and customer response</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Quick Navigation
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fast access to daily tasks
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/dashboard/orders"
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-red-300 hover:bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-900">Manage Orders</p>
                <p className="text-sm text-gray-500">
                  Review and update customer orders
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-red-300 hover:bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-900">Product Catalog</p>
                <p className="text-sm text-gray-500">
                  Add, edit, or update meat products
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/dashboard/#"
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-red-300 hover:bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-900">Customers</p>
                <p className="text-sm text-gray-500">
                  View your customer base and contacts
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-4 py-4 transition hover:border-red-300 hover:bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-900">Store Settings</p>
                <p className="text-sm text-gray-500">
                  Update business information and preferences
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-500">
              Latest customer orders across the store
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="cursor-pointer text-sm font-medium text-red-600 transition hover:text-red-700"
          >
            View all
          </Link>
        </div>

        {dashboard.recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
            <p className="text-sm text-gray-500">No orders found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Items
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-4 text-sm font-medium text-gray-900">
                      #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 text-sm text-gray-700">
                      {getCustomerName(order)}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {getOrderProduct(order)}
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(getOrderAmount(order))}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(getOrderStatus(order))}`}
                      >
                        {getOrderStatus(order)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Bottom cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Order Health</h2>
          <p className="mt-1 text-sm text-gray-500">
            Snapshot of current order flow
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivered</span>
                <span className="font-medium text-gray-900">
                  {dashboard.deliveredOrders}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${dashboard.fulfillmentRate}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-gray-900">
                  {dashboard.pendingOrders}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-yellow-500"
                  style={{
                    width:
                      dashboard.totalOrders > 0
                        ? `${Math.round(
                            (dashboard.pendingOrders / dashboard.totalOrders) *
                              100,
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Cancelled / Failed</span>
                <span className="font-medium text-gray-900">
                  {dashboard.cancelledOrders}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{
                    width:
                      dashboard.totalOrders > 0
                        ? `${Math.round(
                            (dashboard.cancelledOrders /
                              dashboard.totalOrders) *
                              100,
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Small Business Notes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Useful reminders for a new meat store
          </p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Keep orders moving</p>
              <p className="mt-1 text-sm text-gray-600">
                Pending orders should be confirmed quickly to avoid losing
                customers.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Watch average basket</p>
              <p className="mt-1 text-sm text-gray-600">
                Use bundles and family packs to grow average order value.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-medium text-gray-900">Retain repeat buyers</p>
              <p className="mt-1 text-sm text-gray-600">
                Returning customers are important for a new store, so follow up
                after delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
