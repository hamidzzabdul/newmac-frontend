"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Store,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { getWorkerOrders, markWorkerOrderReady } from "@/lib/api/orders";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  createdAt: string;
  total: number;
  customer: {
    fullName?: string;
    phone?: string;
  };
  fulfillment?: {
    method: "home_delivery" | "pickup";
  };
  shippingAddress?: {
    location?: string;
    additionalInfo?: string;
    latitude?: number;
    longitude?: number;
  };
  items: OrderItem[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  completed,
  onMarkReady,
  updating,
}: {
  order: Order;
  completed?: boolean;
  onMarkReady?: () => void;
  updating?: boolean;
}) {
  const isPickup = order.fulfillment?.method === "pickup";

  const mapsUrl =
    order.shippingAddress?.latitude && order.shippingAddress?.longitude
      ? `https://www.google.com/maps?q=${order.shippingAddress.latitude},${order.shippingAddress.longitude}`
      : "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400">Order</p>
          <h2 className="text-lg font-bold text-gray-900">
            #{order.orderNumber}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            completed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {completed ? order.orderStatus.replaceAll("_", " ") : "Pending"}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-500" />
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Items to prepare
            </p>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between gap-3 text-sm">
                <span className="font-semibold text-gray-900">{item.name}</span>
                <span className="text-gray-600 whitespace-nowrap">
                  {item.quantity} kg
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{order.customer?.phone || "No phone"}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            {isPickup ? (
              <Store className="w-4 h-4 text-gray-400" />
            ) : (
              <Truck className="w-4 h-4 text-gray-400" />
            )}
            <span>{isPickup ? "Pick up at shop" : "Home delivery"}</span>
          </div>

          {!isPickup && (
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p>{order.shippingAddress?.location || "No location"}</p>

                {order.shippingAddress?.additionalInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    {order.shippingAddress.additionalInfo}
                  </p>
                )}

                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Open map
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {!completed && (
          <button
            onClick={onMarkReady}
            disabled={updating}
            className="w-full py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-900 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {updating
              ? "Updating..."
              : isPickup
                ? "Mark Ready for Pickup"
                : "Mark as Shipped"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function WorkerOrdersPage() {
  const router = useRouter();

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending",
  );
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");

    if (!raw) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(raw);

    const canAccess = user?.role === "worker" || user?.role === "admin";

    if (!canAccess) {
      router.replace("/");
    }
  }, [router]);

  const loadOrders = async () => {
    try {
      const res = await getWorkerOrders();

      setPendingOrders(res.data.pendingOrders || []);
      setCompletedOrders(res.data.completedOrders || []);
    } catch {
      toast.error("Could not load worker orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkReady = async (orderId: string) => {
    try {
      setUpdatingId(orderId);
      await markWorkerOrderReady(orderId);
      toast.success("Order updated successfully");
      await loadOrders();
    } catch {
      toast.error("Could not update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const ordersToShow =
    activeTab === "pending" ? pendingOrders : completedOrders;

  const deliveryCount = useMemo(
    () =>
      pendingOrders.filter((o) => o.fulfillment?.method === "home_delivery")
        .length,
    [pendingOrders],
  );

  const pickupCount = useMemo(
    () =>
      pendingOrders.filter((o) => o.fulfillment?.method === "pickup").length,
    [pendingOrders],
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading worker orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Prepare customer orders and mark them ready.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon={Clock}
        />
        <StatCard title="Home Deliveries" value={deliveryCount} icon={Truck} />
        <StatCard title="Pickups" value={pickupCount} icon={Store} />
        <StatCard
          title="Completed"
          value={completedOrders.length}
          icon={CheckCircle}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
            activeTab === "pending"
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Pending ({pendingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold cursor-pointer ${
            activeTab === "completed"
              ? "bg-black text-white"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {ordersToShow.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-600">
            No {activeTab} orders found.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {ordersToShow.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              completed={activeTab === "completed"}
              updating={updatingId === order._id}
              onMarkReady={() => handleMarkReady(order._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
