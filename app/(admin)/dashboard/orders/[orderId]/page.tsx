"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "@/lib/api/orders";

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
  updatedAt: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string;
  customer: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
    deliveryNotes?: string;
  };
  payment: {
    method: "mpesa" | "card" | "cod";
    status: "pending" | "paid" | "failed" | "refunded";
    phone?: string;
    mpesaReceiptNumber?: string;
    transactionDate?: string;
    paidAt?: string;
    failureReason?: string;
    card?: {
      provider?: string;
      last4?: string;
      brand?: string;
    };
  };
};

const ORDER_STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  pending: { badge: "bg-yellow-100 text-yellow-700", label: "Pending" },
  confirmed: { badge: "bg-green-100 text-green-700", label: "Confirmed" },
  processing: { badge: "bg-blue-100 text-blue-700", label: "Processing" },
  shipped: { badge: "bg-purple-100 text-purple-700", label: "Shipped" },
  delivered: { badge: "bg-green-100 text-green-700", label: "Delivered" },
  cancelled: { badge: "bg-red-100 text-red-700", label: "Cancelled" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  card: "Card",
  cod: "Cash on Delivery",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  );
}

function PaymentBadge({ method, status }: { method: string; status: string }) {
  const isCod = method === "cod";
  const isPaid = status === "paid";
  const isFailed = status === "failed";

  if (isCod) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-amber-600 text-lg">💵</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Cash on Delivery
          </p>
          <p className="text-xs text-amber-600">
            Payment collected at delivery
          </p>
        </div>
        <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
          Pay on Delivery
        </span>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
        <span className="text-green-600 text-lg">✅</span>
        <div>
          <p className="text-sm font-semibold text-green-800">
            Paid via {PAYMENT_METHOD_LABELS[method] ?? method}
          </p>
          <p className="text-xs text-green-600">Payment confirmed</p>
        </div>
        <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          Paid
        </span>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
        <span className="text-red-600 text-lg">❌</span>
        <div>
          <p className="text-sm font-semibold text-red-800">
            Payment Failed — {PAYMENT_METHOD_LABELS[method] ?? method}
          </p>
          <p className="text-xs text-red-600">
            Customer has not completed payment
          </p>
        </div>
        <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Failed
        </span>
      </div>
    );
  }

  // Pending
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
      <span className="text-yellow-600 text-lg">⏳</span>
      <div>
        <p className="text-sm font-semibold text-yellow-800">
          Awaiting Payment — {PAYMENT_METHOD_LABELS[method] ?? method}
        </p>
        <p className="text-xs text-yellow-600">Payment not yet confirmed</p>
      </div>
      <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
        Pending
      </span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <p className="text-gray-400 text-sm">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">{error ?? "Order not found."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline text-sm cursor-pointer"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const statusStyle = ORDER_STATUS_STYLES[order.orderStatus] ?? {
    badge: "bg-gray-100 text-gray-600",
    label: order.orderStatus,
  };

  const itemsTotal = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              #{order.orderNumber}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyle.badge}`}
            >
              {statusStyle.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Payment Status Banner */}
      <PaymentBadge
        method={order.payment.method}
        status={order.payment.status}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Section title="Customer">
          <InfoRow
            label="Name"
            value={`${order.customer.firstName} ${order.customer.lastName ?? ""}`.trim()}
          />
          <InfoRow label="Email" value={order.customer.email} />
          <InfoRow label="Phone" value={order.customer.phone} />
        </Section>

        {/* Shipping Address */}
        <Section title="Shipping Address">
          <InfoRow label="Street" value={order.shippingAddress.street} />
          <InfoRow label="City" value={order.shippingAddress.city} />
          {order.shippingAddress.postalCode && (
            <InfoRow
              label="Postal Code"
              value={order.shippingAddress.postalCode}
            />
          )}
          <InfoRow label="Country" value={order.shippingAddress.country} />
          {order.shippingAddress.deliveryNotes && (
            <InfoRow
              label="Notes"
              value={order.shippingAddress.deliveryNotes}
            />
          )}
        </Section>
      </div>

      {/* Payment Details */}
      <Section title="Payment Details">
        <InfoRow
          label="Method"
          value={
            PAYMENT_METHOD_LABELS[order.payment.method] ?? order.payment.method
          }
        />
        <InfoRow
          label="Status"
          value={
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                order.payment.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : order.payment.status === "failed"
                    ? "bg-red-100 text-red-700"
                    : order.payment.status === "refunded"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.payment.status}
            </span>
          }
        />
        {/* M-Pesa specific */}
        {order.payment.method === "mpesa" && (
          <>
            {order.payment.phone && (
              <InfoRow label="M-Pesa Phone" value={order.payment.phone} />
            )}
            {order.payment.mpesaReceiptNumber && (
              <InfoRow
                label="Receipt No."
                value={order.payment.mpesaReceiptNumber}
              />
            )}
            {order.payment.transactionDate && (
              <InfoRow
                label="Transaction Date"
                value={order.payment.transactionDate}
              />
            )}
          </>
        )}
        {/* Card specific */}
        {order.payment.method === "card" && order.payment.card && (
          <>
            {order.payment.card.brand && order.payment.card.last4 && (
              <InfoRow
                label="Card"
                value={`${order.payment.card.brand.toUpperCase()} •••• ${order.payment.card.last4}`}
              />
            )}
          </>
        )}
        {order.payment.paidAt && (
          <InfoRow label="Paid At" value={formatDate(order.payment.paidAt)} />
        )}
        {order.payment.failureReason && (
          <InfoRow
            label="Failure Reason"
            value={
              <span className="text-red-600">
                {order.payment.failureReason}
              </span>
            }
          />
        )}
      </Section>

      {/* Order Items */}
      <Section title={`Order Items (${order.items.length})`}>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} kg × KSh {item.price.toLocaleString()}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                KSh {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>KSh {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>KSh {order.shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>KSh {order.total.toLocaleString()}</span>
          </div>
        </div>
      </Section>

      {/* Notes */}
      {order.notes && (
        <Section title="Order Notes">
          <p className="text-sm text-gray-600">{order.notes}</p>
        </Section>
      )}

      {/* Timestamps */}
      <div className="flex gap-6 text-xs text-gray-400 pb-4">
        <span>Created: {formatDate(order.createdAt)}</span>
        <span>Updated: {formatDate(order.updatedAt)}</span>
      </div>
    </div>
  );
}
