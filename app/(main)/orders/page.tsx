"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  estimatedDelivery?: string;
}

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-02-01",
    status: "delivered",
    items: [
      { name: "Premium Beef Ribs", quantity: 2, price: 1200 },
      { name: "Chicken Breast", quantity: 1, price: 800 },
    ],
    total: 2000,
    paymentMethod: "M-Pesa",
    deliveryAddress: "123 Main St, Nairobi",
    estimatedDelivery: "2024-02-03",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-02-02",
    status: "shipped",
    items: [{ name: "Goat Meat", quantity: 3, price: 1500 }],
    total: 1500,
    paymentMethod: "M-Pesa",
    deliveryAddress: "456 Oak Ave, Nairobi",
    estimatedDelivery: "2024-02-05",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-02-03",
    status: "processing",
    items: [
      { name: "Lamb Chops", quantity: 2, price: 1800 },
      { name: "Beef Steak", quantity: 1, price: 1200 },
    ],
    total: 3000,
    paymentMethod: "Card",
    deliveryAddress: "789 Pine Rd, Nairobi",
    estimatedDelivery: "2024-02-06",
  },
];

const MyOrders = () => {
  const [orders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusConfig = (status: Order["status"]) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        dotColor: "bg-yellow-500",
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
                {orders.filter((o) => o.status === "processing").length}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter((o) => o.status === "shipped").length}
              </div>
              <div className="text-sm text-gray-600">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "delivered").length}
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
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
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
                            {new Date(order.date).toLocaleDateString()}
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

                      {/* Delivery Info */}
                      {order.estimatedDelivery &&
                        order.status !== "delivered" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span>
                              Estimated delivery:{" "}
                              <span className="font-semibold text-blue-600">
                                {new Date(
                                  order.estimatedDelivery
                                ).toLocaleDateString()}
                              </span>
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Right: Total & Actions */}
                    <div className="lg:text-right space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-2xl font-bold text-gray-900">
                          KSh {order.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          via {order.paymentMethod}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Invoice
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
                    {getStatusConfig(selectedOrder.status).label}
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-semibold ${
                    getStatusConfig(selectedOrder.status).color
                  }`}
                >
                  {getStatusConfig(selectedOrder.status).label}
                </div>
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
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                  {selectedOrder.estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(
                          selectedOrder.estimatedDelivery
                        ).toLocaleDateString()}
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
                    <span>KSh {selectedOrder.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
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
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Track Order
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
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
