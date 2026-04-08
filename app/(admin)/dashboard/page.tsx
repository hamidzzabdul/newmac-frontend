"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardActions from "../components/DashboardActions";
import { getAdminOrders } from "@/lib/api/orders"; // adjust path

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
  paymentStatus?: string;
  createdAt?: string;
  items?: OrderItem[];
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
  if (order.customerName) return order.customerName;

  const fullName = [order.user?.firstName, order.user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;
  if (order.user?.name) return order.user.name;
  if (order.phone) return order.phone;

  return "Unknown Customer";
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

function getStatusClasses(status?: string) {
  const s = (status || "").toLowerCase();

  if (["delivered", "paid", "completed"].includes(s)) {
    return "bg-green-100 text-green-700";
  }

  if (["processing", "pending"].includes(s)) {
    return "bg-yellow-100 text-yellow-700";
  }

  if (["shipped", "in transit"].includes(s)) {
    return "bg-blue-100 text-blue-700";
  }

  if (["cancelled", "failed"].includes(s)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
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
        console.log("dashboard response:", response);

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
      ["delivered", "confirmed"].includes((o.status || "").toLowerCase()),
    ).length;

    const pendingOrders = orders.filter((o) =>
      ["pending", "processing"].includes((o.status || "").toLowerCase()),
    ).length;

    const uniqueCustomers = new Set(
      orders.map((o) => getCustomerName(o)).filter(Boolean),
    ).size;

    const productMap = new Map<
      string,
      { name: string; sold: number; revenue: number }
    >();

    for (const order of orders) {
      const amount = getOrderAmount(order);

      for (const item of order.items || []) {
        const name = item.product?.name || item.name || "Unnamed product";
        const qty = Number(item.qty ?? item.quantity ?? 1);
        const price = Number(item.price ?? item.product?.price ?? 0);

        if (!productMap.has(name)) {
          productMap.set(name, { name, sold: 0, revenue: 0 });
        }

        const existing = productMap.get(name)!;
        existing.sold += qty;
        existing.revenue += price > 0 ? qty * price : amount;
      }
    }

    const topProducts = [...productMap.values()]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => {
        const ad = new Date(a.createdAt || 0).getTime();
        const bd = new Date(b.createdAt || 0).getTime();
        return bd - ad;
      })
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      uniqueCustomers,
      topProducts,
      recentOrders,
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(dashboard.totalRevenue)}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                From {dashboard.totalOrders} total orders
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {dashboard.totalOrders}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                {dashboard.pendingOrders} pending / processing
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {dashboard.deliveredOrders}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Completed fulfillment
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {dashboard.uniqueCustomers}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Unique customers from orders
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <DashboardActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-600 pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashboard.recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-sm text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  dashboard.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-3 text-sm text-gray-900">
                        #
                        {order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {getCustomerName(order)}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {getOrderProduct(order)}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {formatCurrency(getOrderAmount(order))}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(order.status)}`}
                        >
                          {order.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling</h2>
          </div>

          <div className="space-y-4">
            {dashboard.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No product sales yet</p>
            ) : (
              dashboard.topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">{product.sold} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
