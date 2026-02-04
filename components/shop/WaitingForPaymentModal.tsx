"use client";

import { X, Smartphone, AlertCircle, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onRetry?: () => void;

  isProcessing?: boolean;
  cooldownSeconds?: number;
};

export default function WaitingForPaymentModal({
  open,
  title = "Waiting for payment…",
  message = "Check your phone and enter your M-Pesa PIN to complete payment.",
  onCancel,
  onRetry,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Icon with animated rings */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-green-200 animate-ping opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-green-300 animate-pulse" />
                </div>

                {/* Phone icon */}
                <div className="relative w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>

            {/* Progress steps */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      STK Push Sent
                    </p>
                    <p className="text-xs text-gray-600">
                      Check your phone for the M-Pesa prompt
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Enter PIN
                    </p>
                    <p className="text-xs text-gray-600">
                      Complete the payment on your phone
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Confirmation
                    </p>
                    <p className="text-xs text-gray-500">
                      You&apos;ll be redirected automatically
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full px-6 py-3.5 rounded-xl bg-linear-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  Resend STK Push
                </button>
              )}
              <button
                onClick={onCancel}
                className="w-full px-6 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] cursor-pointer"
              >
                Cancel Payment
              </button>
            </div>

            {/* Info banner */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong className="font-semibold">Keep this page open.</strong>{" "}
                We&apos;ll automatically redirect you once payment is confirmed.
                This usually takes less than 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
