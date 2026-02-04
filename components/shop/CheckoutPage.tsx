"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, MapPin, CreditCard, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/types/checkout.schema";
import { createOrder, getOrder, startMpesaStkPush } from "@/lib/api/orders";
import to254 from "@/lib/api/orders";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import WaitingForPaymentModal from "./WaitingForPaymentModal";

interface CheckoutStep {
  number: number;
  title: string;
  icon: React.ElementType;
}
interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode?: string;
  deliveryNotes?: string;
  paymentMethod: "mpesa" | "card" | "cod";
  mpesaPhone?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  agreeToTerms: boolean;
}

const steps: CheckoutStep[] = [
  { number: 1, title: "Delivery", icon: MapPin },
  { number: 2, title: "Payment", icon: CreditCard },
  { number: 3, title: "Review", icon: Package },
];

interface CheckoutPageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[];
  total: number;
  onBack: () => void;
}

const CheckoutPage = ({ cartItems, total, onBack }: CheckoutPageProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentUI, setPaymentUI] = useState<"mpesa" | "card" | "cod">("mpesa");
  const [showPayModal, setShowPayModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      deliveryNotes: "",
      paymentMethod: "mpesa",
      mpesaPhone: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
      agreeToTerms: false,
    },
  });
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const paymentMethod = getValues("paymentMethod");

  const nextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger([
        "fullName",
        "phone",
        "email",
        "address",
        "city",
      ]);
      if (!valid) return;
      const phone = getValues("phone");
      const mpesa = getValues("mpesaPhone");
      if (!mpesa && phone) {
        setValue("mpesaPhone", phone.replace(/\D/g, "").slice(0, 10), {
          shouldValidate: false,
        });
      }
    }

    if (currentStep === 2) {
      const valid = await trigger(["paymentMethod", "mpesaPhone"], {
        shouldFocus: true,
      });
      if (!valid) return;
    }

    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    if (redirectUrl) {
      // Redirect safely after state updates
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  const onSubmit = async (data: CheckoutFormData) => {
    const [firstName, ...rest] = data.fullName.trim().split(" ");
    const lastName = rest.join(" ") || "";
    const orderPayload = {
      items: cartItems.map((item) => ({
        productId: item.id, // confirm your cart ID field
        quantity: item.quantityKg, // backend expects item.quantity
      })),
      shippingAddress: {
        city: data.city,
        street: data.address,
        postalCode: data.postalCode,
        deliveryNotes: data.deliveryNotes,
      },
      customer: {
        firstName,
        lastName,
        email: data.email,
        phone: to254(data.phone),
      },
      paymentMethod: data.paymentMethod,
    };

    console.log("ORDER PAYLOAD:", orderPayload);

    const orderRes = await createOrder(orderPayload);

    const orderId = orderRes.data.order.id;

    if (data.paymentMethod === "mpesa") {
      const mpesaPhone = to254(data.mpesaPhone || data.phone);

      setShowPayModal(true);
      setActiveOrderId(orderId);

      await startMpesaStkPush(orderId, mpesaPhone);
      toast.success("Order Saved!, check your phone for mpesa prompt");

      // start polling db for payment status
      const startedAt = Date.now();
      const timeoutMs = 2 * 60 * 1000; // 2 minutes
      const intervalMs = 3000;
      const poll = async () => {
        try {
          const res = await getOrder(orderId);
          const status = res.data.order.payment?.status;
          console.log(status);
          if (status === "paid") {
            setShowPayModal(false);
            router.push(`/orders/success?orderId=${orderId}`);
            return;
          }

          if (status === "failed") {
            setShowPayModal(false);
            toast.error("Payment failed or was cancelled.");
            return;
          }

          if (Date.now() - startedAt > timeoutMs) {
            setShowPayModal(false);
            toast.error("Payment not received yet. You can retry.");
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (e) {
          console.log("Polling error:", e);
          // if backend temporarily fails, keep trying a bit
          if (Date.now() - startedAt <= timeoutMs) {
            setTimeout(poll, intervalMs);
          } else {
            setShowPayModal(false);
            toast.error("Could not confirm payment. Try again.");
          }
        }
      };

      poll();
      return;
    }
    if (data.paymentMethod === "cod") {
      toast.success("Order saved ✅. You will pay on delivery.");
      return;
    }
    toast.error("Card payment not implemented yet.");
  };
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <WaitingForPaymentModal
        open={showPayModal}
        onCancel={() => {
          setShowPayModal(false);
          setActiveOrderId(null);
        }}
        onRetry={
          activeOrderId
            ? async () => {
                try {
                  const phone = to254(
                    getValues("mpesaPhone") || getValues("phone")
                  );
                  await startMpesaStkPush(activeOrderId, phone);
                  toast.success("STK push sent again. Check your phone.");
                } catch (e: any) {
                  toast.error("Retry failed. Check backend logs.");
                }
              }
            : undefined
        }
      />
      {/* Header */}
      <div className="bg-white border-b sticky top-20 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Cart</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div
                className="h-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center gap-2 relative"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-600 text-white shadow-lg"
                        : isActive
                        ? "bg-black text-white shadow-xl scale-110"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      isActive ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              {/* Step 1: Delivery Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Delivery Information
                    </h2>
                    <p className="text-gray-600">
                      Where should we deliver your order?
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("fullName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>

                      <div className="relative">
                        {/* Prefix */}
                        <span className="absolute inset-y-0 left-0 flex items-center px-4 text-gray-600 font-medium border-r bg-gray-50 rounded-l-xl">
                          +254
                        </span>

                        {/* Input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          {...register("phone", {
                            onChange: (e) => {
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                            },
                          })}
                          className="w-full pl-20 pr-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                          placeholder="712345678"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        {...register("address")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        placeholder="Street address, building, floor"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        placeholder="Nairobi"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        {...register("postalCode")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                        placeholder="00100"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        {...register("deliveryNotes")}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all resize-none"
                        placeholder="Any special instructions for delivery..."
                      />
                      {errors.deliveryNotes?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.deliveryNotes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Payment Method
                    </h2>
                    <p className="text-gray-600">
                      Choose how you&apos;d like to pay
                    </p>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {/* M-Pesa */}
                    <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-gray-400 has-checked:border-green-600 has-checked:bg-green-50">
                      <input
                        type="radio"
                        value="mpesa"
                        {...register("paymentMethod")}
                        checked={paymentUI === "mpesa"}
                        onChange={() => {
                          setPaymentUI("mpesa");
                          setValue("paymentMethod", "mpesa");
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            M-Pesa
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay securely with M-Pesa STK Push
                        </p>
                      </div>
                      <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">
                        M-PESA
                      </div>
                    </label>

                    {/* Card Payment */}
                    <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-gray-400 has-checked:border-black has-checked:bg-gray-50">
                      <input
                        type="radio"
                        value="card"
                        {...register("paymentMethod")}
                        checked={paymentUI === "card"}
                        onChange={() => {
                          setPaymentUI("card");
                          setValue("paymentMethod", "card");
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Credit/Debit Card
                        </div>
                        <p className="text-sm text-gray-600">
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-6 bg-blue-600 rounded"></div>
                        <div className="w-8 h-6 bg-red-600 rounded"></div>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-gray-400 has-checked:border-black has-checked:bg-gray-50">
                      <input
                        type="radio"
                        value="cod"
                        {...register("paymentMethod")}
                        checked={paymentUI === "cod"}
                        onChange={() => {
                          setPaymentUI("cod");
                          setValue("paymentMethod", "cod");
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Cash on Delivery
                        </div>
                        <p className="text-sm text-gray-600">
                          Pay when you receive your order
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        💵
                      </div>
                    </label>
                  </div>

                  {/* M-Pesa Phone Input */}
                  {paymentUI === "mpesa" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        M-Pesa Phone Number
                        <span className="text-red-500 inline md:hidden">*</span>
                        <span className="text-red-500 text-xs hidden md:inline">
                          (required)
                        </span>
                      </label>

                      <div className="relative">
                        {/* Prefix */}
                        <span className="absolute inset-y-0 left-0 flex items-center px-4 text-gray-600 font-medium border-r bg-green-100 rounded-l-xl">
                          +254
                        </span>

                        {/* Input */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          {...register("mpesaPhone", {
                            onChange: (e) => {
                              e.target.value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                            },
                          })}
                          className="w-full pl-20 pr-4 py-3 rounded-xl border border-green-300 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-all bg-white"
                          placeholder="712345678"
                        />
                      </div>

                      {errors.mpesaPhone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.mpesaPhone.message}
                        </p>
                      )}

                      <p className="text-xs text-gray-600 mt-2">
                        You&apos;ll receive an STK push to complete payment
                      </p>
                    </div>
                  )}

                  {/* Card Details */}
                  {paymentUI === "card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          {...register("cardNumber")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                          placeholder="1234 5678 9012 3456"
                          name="cardNumber"
                          autoComplete="cc-number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            {...register("cardExpiry")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                            placeholder="MM/YY"
                            name="cardExpiry"
                            autoComplete="cc-exp"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            {...register("cardCVV")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                            placeholder="123"
                            name="cardCVV"
                            autoComplete="cc-csc"
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Review Your Order
                    </h2>
                    <p className="text-gray-600">
                      Please verify all details before placing your order
                    </p>
                  </div>

                  {/* Delivery Details */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">
                          {getValues("fullName")}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {getValues("phone")}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {getValues("email")}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">
                          {getValues("address")},{getValues("city")}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="mt-3 text-sm text-blue-400 underline hover:text-blue-700 transition duration-300 font-medium cursor-pointer"
                    >
                      Edit Details
                    </button>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </h3>

                    <p className="text-sm">
                      <span className="font-medium capitalize">
                        {paymentMethod === "mpesa"
                          ? "M-Pesa"
                          : paymentMethod === "card"
                          ? "Credit/Debit Card"
                          : "Cash on Delivery"}
                      </span>

                      {paymentMethod === "mpesa" && (
                        <span className="text-gray-600 ml-2">
                          ({getValues("mpesaPhone")})
                        </span>
                      )}
                    </p>

                    <button
                      onClick={() => setCurrentStep(2)}
                      className="mt-3 text-sm text-blue-400 underline hover:text-blue-700 transition duration-300 font-medium cursor-pointer"
                    >
                      Change Payment
                    </button>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Items ({cartItems.length})
                    </h3>
                    <div className="space-y-3">
                      {cartItems.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantityKg}kg
                          </span>
                          <span className="font-medium">
                            KSh
                            {(
                              item.pricePerKg * item.quantityKg
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{cartItems.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      {...register("agreeToTerms")}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </a>
                      and
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs mt-2">
                      {String(errors.agreeToTerms.message)}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-lg cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-green-600 to-green-700 text-white font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  KSh {total.toLocaleString()}
                </span>
              </div>

              {/* Progress Indicator */}
              <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">
                    Step {currentStep} of 3
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {currentStep === 1 && "Complete delivery information"}
                  {currentStep === 2 && "Choose payment method"}
                  {currentStep === 3 && "Review and confirm order"}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Same-day delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">100% quality guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
