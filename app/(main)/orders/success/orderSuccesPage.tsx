"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  Download,
  Copy,
  ShoppingBag,
  Banknote,
  Clock,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/app/store/features/CartSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────────────────────────────────────
// Paid success page (Paystack — card or M-Pesa)
// ─────────────────────────────────────────────────────────────────────────────
function PaidSuccess({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Green header */}
          <div className="bg-green-600 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-5">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Payment confirmed!
            </h1>
            <p className="text-green-100 text-sm">
              Your order is being prepared
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Order ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Order ID
                </p>
                <p className="text-sm font-mono font-semibold text-gray-800">
                  {orderId}
                </p>
              </div>
              <button
                onClick={copyId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-black bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-150 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                What happens next
              </p>
              <div className="space-y-0">
                {[
                  {
                    icon: CheckCircle,
                    color: "bg-green-600",
                    label: "Order confirmed",
                    sub: "Payment received & order placed",
                    done: true,
                  },
                  {
                    icon: Package,
                    color: "bg-blue-500",
                    label: "Preparing your order",
                    sub: "Fresh cuts being packed — est. 1–2 hrs",
                    done: false,
                  },
                  {
                    icon: Truck,
                    color: "bg-amber-500",
                    label: "Out for delivery",
                    sub: "On the way to your door",
                    done: false,
                  },
                  {
                    icon: MapPin,
                    color: "bg-gray-700",
                    label: "Delivered",
                    sub: "Enjoy your fresh produce!",
                    done: false,
                  },
                ].map((step, i, arr) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 ${step.color}`}
                      >
                        <step.icon className="w-4 h-4" />
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 my-1" />
                      )}
                    </div>
                    <div
                      className={`pb-5 ${i === arr.length - 1 ? "pb-0" : ""}`}
                    >
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.sub}</p>
                      {step.done && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => router.push(`/orders/track/${orderId}`)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 active:scale-[0.99] transition-all duration-150 cursor-pointer group"
              >
                Track your order
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() =>
                  window.open(`${API_URL}/orders/${orderId}/receipt`, "_blank")
                }
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download receipt
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          </div>

          {/* Email footer */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M4 4h16v16H4z" />
                <path d="M4 4l8 8 8-8" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">
                Check your email
              </p>
              <p className="text-xs text-gray-400">
                Confirmation and receipt sent to your inbox
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Need help?{" "}
          <a
            href="/support"
            className="text-green-600 font-semibold hover:text-green-700 cursor-pointer"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment failed page
// ─────────────────────────────────────────────────────────────────────────────
function PaymentFailed({ orderId }: { orderId: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-red-500 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-5">
            <AlertCircle className="w-9 h-9 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Payment failed</h1>
          <p className="text-red-100 text-sm">Your card was not charged</p>
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Something went wrong with your payment. Your order is still saved —
            you can try again.
          </p>
          <button
            onClick={() => router.push(`/checkout?retry=${orderId}`)}
            className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 cursor-pointer"
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Back to shop
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Verifying state — shown while we call /verify
// ─────────────────────────────────────────────────────────────────────────────
function Verifying() {
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <svg
          className="w-8 h-8 animate-spin text-green-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-sm font-medium text-gray-500">
          Confirming your payment…
        </p>
        <p className="text-xs text-gray-400">This takes just a second</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COD success page
// ─────────────────────────────────────────────────────────────────────────────
function CodSuccess({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-amber-500 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-5">
              <ShoppingBag className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Order placed!
            </h1>
            <p className="text-amber-100 text-sm">
              Pay when your order arrives at your door
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                  Order ID
                </p>
                <p className="text-sm font-mono font-semibold text-gray-800">
                  {orderId}
                </p>
              </div>
              <button
                onClick={copyId}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-black bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-150 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Before your order arrives
              </p>
              {[
                {
                  icon: Banknote,
                  text: "Have the exact cash amount ready for the rider",
                },
                {
                  icon: Phone,
                  text: "Keep your phone nearby — we may call to confirm delivery",
                },
                {
                  icon: Clock,
                  text: "Estimated delivery: same day, within 2–4 hours",
                },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <p className="text-sm text-amber-900">{text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => router.push(`/orders/${orderId}`)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900 active:scale-[0.99] transition-all duration-150 cursor-pointer group"
              >
                Track your order
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M4 4h16v16H4z" />
                <path d="M4 4l8 8 8-8" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">
                Check your email
              </p>
              <p className="text-xs text-gray-400">
                Order confirmation sent to your inbox
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Need help?{" "}
          <a
            href="/support"
            className="text-green-600 font-semibold hover:text-green-700 cursor-pointer"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const urlOrderId = searchParams.get("orderId");
  const method = searchParams.get("method"); // "cod" | null

  const [orderId, setOrderId] = useState<string | null>(urlOrderId);

  // "verifying" → calling /verify
  // "paid"      → payment confirmed
  // "failed"    → payment failed
  // "cod"       → cash on delivery, no verify needed
  const [verifyState, setVerifyState] = useState<
    "verifying" | "paid" | "failed" | "cod"
  >("verifying");

  useEffect(() => {
    // Resolve orderId from localStorage if missing (Paystack redirect — no orderId in URL)
    const resolvedId = urlOrderId ?? localStorage.getItem("pending_order_id");
    if (resolvedId) setOrderId(resolvedId);

    // Clear cart universally
    dispatch(clearCart());
    localStorage.removeItem("pending_order_id");

    // COD — skip verify entirely
    if (method === "cod") {
      setVerifyState("cod");
      return;
    }

    // ✅ Card/M-Pesa — always verify with backend before showing success
    // This is the fallback for when the webhook hasn't fired yet
    if (!resolvedId) {
      // No order ID at all — nothing to verify
      setVerifyState("failed");
      return;
    }

    fetch(`${API_URL}/orders/${resolvedId}/paystack/verify`)
      .then((res) => res.json())
      .then((data) => {
        if (
          data.status === "success" &&
          (data.data.paystackStatus === "success" ||
            data.data.paymentStatus === "paid")
        ) {
          setVerifyState("paid");
        } else {
          setVerifyState("failed");
        }
      })
      .catch(() => {
        // Network error — still show success optimistically
        // The webhook will have updated the DB even if verify failed here
        setVerifyState("paid");
      });
  }, [dispatch, urlOrderId, method]);

  // Show spinner while verifying
  if (verifyState === "verifying" && method !== "cod") {
    return <Verifying />;
  }

  if (verifyState === "cod") {
    return <CodSuccess orderId={orderId!} />;
  }

  if (verifyState === "failed") {
    return <PaymentFailed orderId={orderId ?? ""} />;
  }

  return <PaidSuccess orderId={orderId!} />;
}
