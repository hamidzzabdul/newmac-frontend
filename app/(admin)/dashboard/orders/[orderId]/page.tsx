"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Download,
  Printer,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const router = useRouter();

  // Sample order data - this would come from your API/state management
  const [order, setOrder] = useState({
    id: "#ORD-2341",
    status: "Delivered",
    date: "Dec 28, 2024",
    deliveredDate: "Dec 30, 2024",
    customer: {
      name: "John Kamau",
      email: "john@example.com",
      phone: "+254 712 345 678",
      address: "123 Kimathi Street, Nairobi, Kenya",
    },
    items: [
      {
        id: 1,
        name: "Premium Beef (T-Bone)",
        sku: "BEEF-001",
        quantity: 2,
        price: 1200,
      },
      {
        id: 2,
        name: "Chicken Breast",
        sku: "CHKN-045",
        quantity: 1,
        price: 650,
      },
      { id: 3, name: "Pork Chops", sku: "PORK-032", quantity: 1, price: 600 },
    ],
    subtotal: 2450,
    shipping: 200,
    tax: 0,
    total: 2650,
    paymentMethod: "M-Pesa",
    trackingNumber: "TRK-2341-KE-2024",
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleStatusUpdate = () => {
    setOrder({ ...order, status: selectedStatus });
    setShowStatusModal(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Delivered: "bg-green-100 text-green-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      Delivered: CheckCircle,
      Processing: Clock,
      Shipped: Truck,
      Pending: Clock,
    };
    const Icon = icons[status as keyof typeof icons] || Package;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order {order.id}
              </h1>
              <p className="text-gray-600">Placed on {order.date}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            <div
              className="absolute top-5 left-0 h-0.5 bg-green-500 z-0"
              style={{ width: "100%" }}
            ></div>

            {["Pending", "Processing", "Shipped", "Delivered"].map(
              (status, index) => (
                <div
                  key={status}
                  className="flex flex-col items-center z-10 relative"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= 3
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {getStatusIcon(status)}
                  </div>
                  <p className="text-sm font-medium mt-2">{status}</p>
                  {index === 3 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {order.deliveredDate}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        KSh {item.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KSh {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>KSh {order.shipping.toLocaleString()}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>KSh {order.tax.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a
                      href={`mailto:${order.customer.email}`}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {order.customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {order.customer.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-gray-900">{order.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {order.paymentMethod}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Update Status
                </button>
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Update Order Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ].map((status) => (
                  <label
                    key={status}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mr-3 cursor-pointer"
                    />
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
