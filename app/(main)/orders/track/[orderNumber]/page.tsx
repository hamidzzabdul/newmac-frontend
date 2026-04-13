"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  BadgeCheck,
  ArrowLeft,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { getMyOrders } from "@/lib/api/orders";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt?: string;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  items: { product: string; name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    deliveryNotes?: string;
  };
  payment: {
    method: "mpesa" | "card" | "cod";
    status: "pending" | "paid" | "failed" | "refunded";
    mpesaReceiptNumber?: string;
  };
}

const STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    description: "We've received your order",
    icon: Clock,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    description: "Your order has been confirmed",
    icon: BadgeCheck,
  },
  {
    key: "processing",
    label: "Processing",
    description: "We're preparing your items",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on its way",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Order delivered successfully",
    icon: CheckCircle,
  },
];

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export default function OrderTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders();
        const found = res.data.orders.find(
          (o: Order) => o.orderNumber === orderNumber,
        );
        if (!found) throw new Error("Order not found");
        setOrder(found);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading tracking info...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold mb-4">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "cancelled";
  const currentStepIndex = isCancelled
    ? -1
    : STATUS_ORDER.indexOf(order.orderStatus);

  const formatAddress = (addr: Order["shippingAddress"]) =>
    [addr.street, addr.city, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Orders
        </button>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                Order Number
              </p>
              <h1 className="text-2xl font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {isCancelled ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shrink-0">
                Cancelled
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shrink-0">
                {order.orderStatus.charAt(0).toUpperCase() +
                  order.orderStatus.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Tracking stepper */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
            Tracking
          </h2>

          {isCancelled ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <XCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="font-semibold text-gray-800">Order Cancelled</p>
              <p className="text-sm text-gray-500 mt-1">
                This order has been cancelled
              </p>
            </div>
          ) : (
            <div className="relative">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isDone = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;
                const isLast = index === STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Icon + line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isDone
                            ? "bg-green-500"
                            : isCurrent
                              ? "bg-black ring-4 ring-black/10"
                              : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isDone
                              ? "text-white"
                              : isCurrent
                                ? "text-white"
                                : "text-gray-400"
                          }`}
                        />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-12 mt-1 rounded-full transition-all ${
                            isDone ? "bg-green-400" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="pb-8 pt-1.5">
                      <p
                        className={`text-sm font-bold ${
                          isUpcoming ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          isUpcoming ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-black text-white text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Delivery Address
          </h2>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {formatAddress(order.shippingAddress) || "No address provided"}
              </p>
              {order.shippingAddress.deliveryNotes && (
                <p className="text-xs text-gray-500 mt-1">
                  Note: {order.shippingAddress.deliveryNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
            Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-base font-bold text-gray-900">
              KSh {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 py-3 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            All Orders
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
