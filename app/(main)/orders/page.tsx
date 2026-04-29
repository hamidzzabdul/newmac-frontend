"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
  RefreshCw,
  BadgeCheck,
  CreditCard,
  MapPin,
} from "lucide-react";
import {
  getMyOrders,
  downloadReceipt,
  initializePaystackPayment,
  cancelOrder,
} from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  orderStatus:
    | "pending_payment"
    | "confirmed"
    | "processing"
    | "shipped"
    | "ready_for_pickup"
    | "delivered"
    | "picked_up"
    | "cancelled"
    | "payment_failed";
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingFee: number;
  payment: {
    method: "mpesa" | "card" | "cod";
    status: "pending" | "paid" | "failed" | "refunded";
    mpesaReceiptNumber?: string;
  };
  fulfillment?: {
    method?: "home_delivery" | "pickup";
  };
  shippingAddress?: {
    location?: string;
    additionalInfo?: string;
  };
}

const MyOrders = () => {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(
    null,
  );
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err: any) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    fetchOrders();
  }, [mounted]);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        label: string;
        color: string;
        icon: any;
        dotColor: string;
      }
    > = {
      pending_payment: {
        label: "Pending Payment",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        dotColor: "bg-yellow-500",
      },
      confirmed: {
        label: "Confirmed",
        color: "bg-teal-100 text-teal-800 border-teal-200",
        icon: BadgeCheck,
        dotColor: "bg-teal-500",
      },
      processing: {
        label: "Processing",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package,
        dotColor: "bg-blue-500",
      },
      shipped: {
        label: "Shipped",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Truck,
        dotColor: "bg-purple-500",
      },
      ready_for_pickup: {
        label: "Ready for Pickup",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: Package,
        dotColor: "bg-indigo-500",
      },
      delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        dotColor: "bg-green-500",
      },
      picked_up: {
        label: "Picked Up",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
        dotColor: "bg-emerald-500",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        dotColor: "bg-red-500",
      },
      payment_failed: {
        label: "Payment Failed",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        dotColor: "bg-red-500",
      },
    };

    return (
      configs[status] || {
        label: status.replace(/_/g, " "),
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Clock,
        dotColor: "bg-gray-500",
      }
    );
  };

  const formatPaymentMethod = (method: Order["payment"]["method"]) => {
    return {
      mpesa: "M-Pesa",
      card: "Card",
      cod: "Cash on Delivery",
    }[method];
  };

  const formatAddress = (order: Order) => {
    if (order.fulfillment?.method === "pickup") {
      return "Pickup at shop";
    }

    const location = order.shippingAddress?.location;
    const additionalInfo = order.shippingAddress?.additionalInfo;

    return [location, additionalInfo].filter(Boolean).join(" • ") || "N/A";
  };

  const isPendingPaymentOrder = (order: Order) => {
    return (
      order.orderStatus === "pending_payment" &&
      order.payment.status === "pending"
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.orderStatus === filterStatus;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesStatus && matchesSearch;
  });

  const handleDownloadReceipt = async (
    orderId: string,
    orderNumber: string,
  ) => {
    if (downloadingOrderId === orderId) return;

    try {
      setDownloadingOrderId(orderId);

      const blob = await downloadReceipt(orderId);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to download invoice");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  const handlePayNow = async (orderId: string) => {
    if (payingOrderId === orderId) return;

    try {
      setPayingOrderId(orderId);

      const res = await initializePaystackPayment(orderId);
      console.log("PAYSTACK INIT RESPONSE:", res);
      const paymentUrl =
        res?.data?.authorizationUrl ||
        res?.data?.authorization_url ||
        res?.data?.paymentUrl ||
        res?.data?.data?.authorization_url ||
        res?.data?.data?.authorizationUrl ||
        res?.authorizationUrl ||
        res?.authorization_url ||
        res?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Payment link was not returned");
      }

      window.location.href = paymentUrl;
    } catch (err: any) {
      toast.error(err.message || "Failed to start payment");
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (cancellingOrderId === orderId) return;

    try {
      setCancellingOrderId(orderId);

      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await fetchOrders();

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err: any) {
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-gray-200">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load orders
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                "all",
                "pending_payment",
                "confirmed",
                "processing",
                "shipped",
                "ready_for_pickup",
                "delivered",
                "picked_up",
                "cancelled",
                "payment_failed",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    filterStatus === status
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status
                        .split("_")
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() + part.slice(1),
                        )
                        .join(" ")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {
                  orders.filter(
                    (o) =>
                      o.orderStatus === "processing" ||
                      o.orderStatus === "confirmed",
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.orderStatus === "shipped").length}
              </div>
              <div className="text-sm text-gray-600">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  orders.filter(
                    (o) =>
                      o.orderStatus === "delivered" ||
                      o.orderStatus === "picked_up",
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search"
                  : "You haven't placed any orders yet"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusConfig.color}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}
                              ></span>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-gray-600">
                                Qty: {item.quantity} × KSh{" "}
                                {item.price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500 pl-15">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            order.payment.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : order.payment.status === "failed"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          Payment:{" "}
                          {order.payment.status.charAt(0).toUpperCase() +
                            order.payment.status.slice(1)}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
                          {order.fulfillment?.method === "pickup"
                            ? "Pickup"
                            : "Home Delivery"}
                        </span>
                      </div>
                    </div>

                    <div className="lg:text-right space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-2xl font-bold text-gray-900">
                          KSh {order.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          via {formatPaymentMethod(order.payment.method)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        {order.payment.status === "paid" && (
                          <button
                            onClick={() =>
                              handleDownloadReceipt(
                                order._id,
                                order.orderNumber,
                              )
                            }
                            disabled={downloadingOrderId === order._id}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4" />
                            {downloadingOrderId === order._id
                              ? "Downloading..."
                              : "Invoice"}
                          </button>
                        )}

                        {isPendingPaymentOrder(order) && (
                          <>
                            <button
                              onClick={() => handlePayNow(order._id)}
                              disabled={payingOrderId === order._id}
                              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CreditCard className="w-4 h-4" />
                              {payingOrderId === order._id
                                ? "Redirecting..."
                                : "Pay Now"}
                            </button>

                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancellingOrderId === order._id}
                              className="px-6 py-2.5 border-2 border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-4 h-4" />
                              {cancellingOrderId === order._id
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Order Status</div>
                  <div className="font-semibold text-gray-900">
                    {getStatusConfig(selectedOrder.orderStatus).label}
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm border ${getStatusConfig(selectedOrder.orderStatus).color}`}
                >
                  {getStatusConfig(selectedOrder.orderStatus).label}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Quantity: {item.quantity}kg
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          @ KSh {item.price.toLocaleString()}/kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Delivery Information
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Method:
                    </span>
                    <span className="font-semibold text-gray-900 text-right max-w-xs">
                      {selectedOrder.fulfillment?.method === "pickup"
                        ? "Pickup at shop"
                        : "Home Delivery"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-semibold text-gray-900 text-right max-w-xs">
                      {formatAddress(selectedOrder)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      KSh{" "}
                      {selectedOrder.subtotal?.toLocaleString() ??
                        selectedOrder.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>
                      {selectedOrder.fulfillment?.method === "pickup"
                        ? "Pickup Fee"
                        : "Delivery Fee"}
                    </span>
                    {selectedOrder.shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span>
                        KSh {selectedOrder.shippingFee.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-bold text-gray-900 text-lg">
                      Total
                    </span>
                    <span className="font-bold text-gray-900 text-lg">
                      KSh {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold text-gray-900">
                      {formatPaymentMethod(selectedOrder.payment.method)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span
                      className={`font-semibold ${
                        selectedOrder.payment.status === "paid"
                          ? "text-green-600"
                          : selectedOrder.payment.status === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {selectedOrder.payment.status.charAt(0).toUpperCase() +
                        selectedOrder.payment.status.slice(1)}
                    </span>
                  </div>

                  {selectedOrder.payment.mpesaReceiptNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">M-Pesa Receipt</span>
                      <span className="font-mono font-semibold text-gray-900">
                        {selectedOrder.payment.mpesaReceiptNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    router.push(`/orders/track/${selectedOrder._id}`);
                  }}
                  className="flex-1 w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Track Order
                </button>

                {isPendingPaymentOrder(selectedOrder) && (
                  <>
                    <button
                      onClick={() => handlePayNow(selectedOrder._id)}
                      disabled={payingOrderId === selectedOrder._id}
                      className="flex-1 w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {payingOrderId === selectedOrder._id
                        ? "Redirecting..."
                        : "Pay Now"}
                    </button>

                    <button
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={cancellingOrderId === selectedOrder._id}
                      className="flex-1 w-full px-6 py-3 border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {cancellingOrderId === selectedOrder._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => router.push("/contact")}
                  className="flex-1 w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
