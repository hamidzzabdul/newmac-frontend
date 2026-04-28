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
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone: string;
  };

  fulfillment?: {
    method: "home_delivery" | "pickup";
  };

  items: OrderItem[];

  shippingAddress?: {
    location?: string;
    additionalInfo?: string;
    latitude?: number;
    longitude?: number;
    distanceKm?: number;
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
  pending_payment: {
    badge: "bg-yellow-100 text-yellow-700",
    label: "Pending Payment",
  },
  confirmed: { badge: "bg-green-100 text-green-700", label: "Confirmed" },
  processing: { badge: "bg-blue-100 text-blue-700", label: "Processing" },
  shipped: { badge: "bg-purple-100 text-purple-700", label: "Shipped" },
  ready_for_pickup: {
    badge: "bg-indigo-100 text-indigo-700",
    label: "Ready for Pickup",
  },
  delivered: { badge: "bg-green-100 text-green-700", label: "Delivered" },
  picked_up: { badge: "bg-green-100 text-green-700", label: "Picked Up" },
  cancelled: { badge: "bg-red-100 text-red-700", label: "Cancelled" },
  payment_failed: {
    badge: "bg-red-100 text-red-700",
    label: "Payment Failed",
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  mpesa: "M-Pesa",
  card: "M-Pesa / Card",
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
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right break-words">
        {value || "—"}
      </span>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentBadge({ method, status }: { method: string; status: string }) {
  if (method === "cod") {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
        <span className="text-amber-600 text-lg">💵</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Cash on Delivery
          </p>
          <p className="text-xs text-amber-600">
            Customer will pay when order is delivered
          </p>
        </div>
        <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
          COD
        </span>
      </div>
    );
  }

  if (status === "paid") {
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

  if (status === "failed") {
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

  const customerName =
    order.customer.fullName ||
    `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim();

  const isPickup = order.fulfillment?.method === "pickup";

  const lat = order.shippingAddress?.latitude;
  const lng = order.shippingAddress?.longitude;

  const hasCoordinates = typeof lat === "number" && typeof lng === "number";

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : "";
  const buildWhatsAppLink = () => {
    const name =
      order.customer.fullName ||
      `${order.customer.firstName ?? ""} ${order.customer.lastName ?? ""}`.trim();

    const phone = order.customer.phone;

    const location = order.shippingAddress?.location || "Not provided";
    const notes = order.shippingAddress?.additionalInfo || "";
    const lat = order.shippingAddress?.latitude;
    const lng = order.shippingAddress?.longitude;

    const mapsLink =
      lat && lng
        ? `https://www.google.com/maps?q=${lat},${lng}`
        : "No map link available";

    const message = `
*NEW DELIVERY ORDER*

Order: #${order.orderNumber}
 Customer: ${name}
 Phone: ${phone}

 Location: ${location}
${notes ? ` Notes: ${notes}` : ""}

🗺️ Map:
${mapsLink}
  `;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
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

      <PaymentBadge
        method={order.payment.method}
        status={order.payment.status}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Customer">
          <InfoRow label="Name" value={customerName} />
          <InfoRow label="Phone" value={order.customer.phone} />
          <InfoRow
            label="Email"
            value={order.customer.email || "Not provided"}
          />
        </Section>

        <Section title="Fulfillment">
          <InfoRow
            label="Method"
            value={isPickup ? "Pick up at Shop" : "Home Delivery"}
          />
          <InfoRow
            label="Delivery Fee"
            value={`KSh ${order.shippingFee.toLocaleString()}`}
          />
          <InfoRow
            label="Total"
            value={`KSh ${order.total.toLocaleString()}`}
          />
        </Section>
      </div>

      {!isPickup && (
        <Section title="Shipping Information">
          <div className="space-y-1">
            <InfoRow
              label="Location"
              value={order.shippingAddress?.location || "Not provided"}
            />

            <InfoRow
              label="Additional Info"
              value={order.shippingAddress?.additionalInfo || "None"}
            />

            <InfoRow
              label="Distance"
              value={
                order.shippingAddress?.distanceKm !== undefined &&
                order.shippingAddress?.distanceKm !== null
                  ? `${order.shippingAddress.distanceKm} km from shop`
                  : "Not calculated"
              }
            />

            <InfoRow
              label="Coordinates"
              value={
                hasCoordinates
                  ? `${lat!.toFixed(6)}, ${lng!.toFixed(6)}`
                  : "Not available"
              }
            />

            {hasCoordinates && (
              <div className="pt-4">
                <div className="w-full flex items-center justify-between">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 cursor-pointer"
                  >
                    Open Location in Google Maps
                  </a>
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 cursor-pointer"
                  >
                    Send to Rider (WhatsApp)
                  </a>
                </div>

                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                  <iframe
                    title="Delivery location map"
                    width="100%"
                    height="260"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
                    className="border-0"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

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

        {order.payment.phone && (
          <InfoRow label="Payment Phone" value={order.payment.phone} />
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

        {order.payment.card?.brand && order.payment.card?.last4 && (
          <InfoRow
            label="Card"
            value={`${order.payment.card.brand.toUpperCase()} •••• ${
              order.payment.card.last4
            }`}
          />
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

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>KSh {order.subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>{isPickup ? "Pickup" : "Shipping"}</span>
            <span>
              {isPickup ? "Free" : `KSh ${order.shippingFee.toLocaleString()}`}
            </span>
          </div>

          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>KSh {order.total.toLocaleString()}</span>
          </div>
        </div>
      </Section>

      {order.notes && (
        <Section title="Order Notes">
          <p className="text-sm text-gray-600">{order.notes}</p>
        </Section>
      )}

      <div className="flex gap-6 text-xs text-gray-400 pb-4">
        <span>Created: {formatDate(order.createdAt)}</span>
        <span>Updated: {formatDate(order.updatedAt)}</span>
      </div>
    </div>
  );
}
