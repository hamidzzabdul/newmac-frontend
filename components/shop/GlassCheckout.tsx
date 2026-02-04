"use client";

import { useState } from "react";
import { ArrowLeft, Check, Sparkles, Lock, Zap } from "lucide-react";

interface GlassCheckoutProps {
  cartItems: any[];
  total: number;
  onBack: () => void;
}

const GlassCheckout = ({ cartItems, total, onBack }: GlassCheckoutProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    paymentMethod: "mpesa",
    mpesaPhone: "",
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Order placed:", formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-violet-600 via-purple-600 to-pink-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-5">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left - Form (3 columns) */}
            <div className="lg:col-span-3">
              {/* Glass Card */}
              <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8 lg:p-10">
                {/* Header with Icon */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Checkout
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Complete your order in seconds
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Step {currentStep} of 2
                    </span>
                    <span className="text-sm text-gray-500">
                      {currentStep === 1 ? "Details" : "Payment"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-violet-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${(currentStep / 2) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step 1: Contact & Delivery */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateFormData("fullName", e.target.value)
                        }
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-gray-900 font-medium"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            updateFormData("phone", e.target.value)
                          }
                          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-gray-900 font-medium"
                          placeholder="+254 712 345 678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            updateFormData("email", e.target.value)
                          }
                          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-gray-900 font-medium"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-gray-900 font-medium"
                        placeholder="Street, Building, Floor"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all text-gray-900 font-medium"
                        placeholder="Nairobi"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-3">
                      {/* M-Pesa Option */}
                      <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg has-checked:border-violet-500 has-checked:bg-violet-50 has-checked:shadow-xl">
                        <input
                          type="radio"
                          name="payment"
                          value="mpesa"
                          checked={formData.paymentMethod === "mpesa"}
                          onChange={(e) =>
                            updateFormData("paymentMethod", e.target.value)
                          }
                          className="w-5 h-5 accent-violet-600"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            M-Pesa
                          </div>
                          <div className="text-sm text-gray-600">
                            Instant payment via STK Push
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm">
                          RECOMMENDED
                        </div>
                      </label>

                      {/* Card Option */}
                      <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg has-checked:border-violet-500 has-checked:bg-violet-50 has-checked:shadow-xl">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={(e) =>
                            updateFormData("paymentMethod", e.target.value)
                          }
                          className="w-5 h-5 accent-violet-600"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            Credit/Debit Card
                          </div>
                          <div className="text-sm text-gray-600">
                            Visa, Mastercard accepted
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-10 h-7 bg-linear-to-br from-blue-600 to-blue-700 rounded-md"></div>
                          <div className="w-10 h-7 bg-linear-to-br from-red-600 to-orange-600 rounded-md"></div>
                        </div>
                      </label>

                      {/* Cash Option */}
                      <label className="flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg has-checked:border-violet-500 has-checked:bg-violet-50 has-checked:shadow-xl">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={(e) =>
                            updateFormData("paymentMethod", e.target.value)
                          }
                          className="w-5 h-5 accent-violet-600"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            Cash on Delivery
                          </div>
                          <div className="text-sm text-gray-600">
                            Pay when you receive
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* M-Pesa Phone Input */}
                    {formData.paymentMethod === "mpesa" && (
                      <div className="p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          M-Pesa Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.mpesaPhone}
                          onChange={(e) =>
                            updateFormData("mpesaPhone", e.target.value)
                          }
                          className="w-full px-5 py-4 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all text-gray-900 font-medium"
                          placeholder="+254 712 345 678"
                        />
                        <div className="flex items-start gap-2 mt-3 text-sm text-gray-700">
                          <Zap className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span>
                            You&apos;ll receive an STK push notification to
                            authorize payment
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-10">
                  {currentStep === 2 && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                  )}
                  {currentStep === 1 ? (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 px-8 py-5 rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 text-white font-bold hover:from-violet-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
                    >
                      Continue to Payment
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-8 py-5 rounded-2xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Place Secure Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Order Summary (2 columns) */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 p-8 sticky top-28">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                {/* Items Preview */}
                <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                  {cartItems.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center pb-3 border-b border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.quantityKg}kg × KSh {item.pricePerKg}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        KSh{" "}
                        {(item.pricePerKg * item.quantityKg).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    KSh {total.toLocaleString()}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 p-5 bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900">
                        Secure Checkout
                      </div>
                      <div className="text-gray-600 text-xs">
                        256-bit SSL encryption
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900">
                        Fast Delivery
                      </div>
                      <div className="text-gray-600 text-xs">
                        Same-day shipping available
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900">
                        Quality Guaranteed
                      </div>
                      <div className="text-gray-600 text-xs">
                        100% fresh products
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GlassCheckout;
