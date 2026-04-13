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
} from "lucide-react";
import { getMyOrders, downloadReceipt } from "@/lib/api/orders"; // adjust path as needed
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
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingFee: number;
  payment: {
    method: "mpesa" | "card" | "cod";
    status: "pending" | "paid" | "failed" | "refunded";
    mpesaReceiptNumber?: string;
  };
  shippingAddress: {
    street?: string;
    city?: string;
    postalCode?: string;
    deliveryNotes?: string;
    country?: string;
  };
}

const MyOrders = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Component mounted, fetching orders...");
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchOrders = async () => {
    console.log("Fetching orders...");
    try {
      setLoading(true);
      setError(null);

      // Add this temporarily to debug
      const token = localStorage.getItem("auth_token");
      console.log("Token:", token);

      const res = await getMyOrders();
      console.log("Orders response:", res);
      setOrders(res.data.orders);
    } catch (err: any) {
      console.error("Full error:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted) return; // ← wait for client
    fetchOrders();
  }, [mounted]);

  const getStatusConfig = (status: Order["orderStatus"]) => {
    const configs = {
      pending: {
        label: "Pending",
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
      delivered: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        dotColor: "bg-green-500",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        dotColor: "bg-red-500",
      },
    };
    return configs[status];
  };

  const formatPaymentMethod = (method: Order["payment"]["method"]) => {
    return { mpesa: "M-Pesa", card: "Card", cod: "Cash on Delivery" }[method];
  };

  const formatAddress = (addr: Order["shippingAddress"]) => {
    return [addr.street, addr.city, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(", ");
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

      console.log("Downloading receipt for:", orderId); // 👈
      const blob = await downloadReceipt(orderId);
      console.log("Blob received:", blob.type, blob.size); // 👈

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
      console.error("Download failed at:", err); // 👈
      toast.error(err.message || "Failed to download invoice");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  // ── Loading State ──────────────────────────────────────────────
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

  // ── Error State ────────────────────────────────────────────────
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
            className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
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

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                "all",
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
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
                {orders.filter((o) => o.orderStatus === "delivered").length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
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
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
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

                      {/* Items Preview */}
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

                      {/* Payment status pill */}
                      <div className="flex items-center gap-2 text-sm">
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
                      </div>
                    </div>

                    {/* Right: Total & Actions */}
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
                        <button
                          onClick={() =>
                            handleDownloadReceipt(order._id, order.orderNumber)
                          }
                          disabled={downloadingOrderId === order._id}
                          className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          {downloadingOrderId === order._id
                            ? "Downloading..."
                            : "Invoice"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
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
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Status */}
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

              {/* Items */}
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

              {/* Delivery Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Delivery Information
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-semibold text-gray-900 text-right max-w-xs">
                      {formatAddress(selectedOrder.shippingAddress)}
                    </span>
                  </div>
                  {selectedOrder.shippingAddress.deliveryNotes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notes:</span>
                      <span className="font-semibold text-gray-900 text-right max-w-xs">
                        {selectedOrder.shippingAddress.deliveryNotes}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
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
                    <span>Delivery Fee</span>
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

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    router.push(`/orders/track/${selectedOrder.orderNumber}`);
                  }}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Track Order
                </button>
                <button
                  onClick={() => router.push("/contact")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
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
