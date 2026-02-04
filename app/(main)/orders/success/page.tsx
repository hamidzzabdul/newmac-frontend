"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    "#10b981",
                    "#34d399",
                    "#6ee7b7",
                    "#a7f3d0",
                    "#fbbf24",
                    "#f59e0b",
                  ][Math.floor(Math.random() * 6)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative max-w-2xl w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          {/* Header with checkmark */}
          <div className="bg-linear-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4 animate-bounce-slow">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-green-50 text-lg">
                Your order has been confirmed
              </p>
            </div>
          </div>

          {/* Order details */}
          <div className="p-8">
            {/* Order ID */}
            <div className="mb-8 p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-2xl font-bold font-mono text-gray-900">
                    {orderId || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(orderId || "")}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Copy ID
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                What happens next?
              </h2>
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-full bg-linear-to-b from-green-600 to-blue-400 mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order Confirmed
                    </h3>
                    <p className="text-sm text-gray-600">
                      We&apos;ve received your payment and are processing your
                      order
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      Completed
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-full bg-linear-to-b from-blue-400 to-amber-400 mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Preparing Your Order
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our team is carefully packing your fresh produce
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Estimated: Within 2-4 hours
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="w-0.5 h-full bg-linear-to-b from-amber-400 to-purple-400 mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Out for Delivery
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your order is on its way to your doorstep
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Same-day delivery available
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Delivered!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enjoy your fresh, quality produce
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/orders/${orderId}`)}
                className="w-full px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
              >
                Track Your Order
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    /* Share functionality */
                  }}
                  className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 text-gray-700 font-semibold hover:text-gray-900 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Footer banner */}
          <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                📧
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Check your email
                </h3>
                <p className="text-sm text-gray-600">
                  We&apos;ve sent order confirmation and receipt to your email
                  address
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <a
              href="/support"
              className="text-green-600 font-semibold hover:text-green-700"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
