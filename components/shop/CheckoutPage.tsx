"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, MapPin, CreditCard, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/types/checkout.schema";
import { createOrder } from "@/lib/api/orders";
import to254 from "@/lib/api/orders";
import toast from "react-hot-toast";
import { clearCart } from "@/app/store/features/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import Link from "next/link";
import { initializePaystackPayment } from "@/lib/api/orders";

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
  paymentMethod: "card" | "cod";
  agreeToTerms: boolean;
}

const steps: CheckoutStep[] = [
  { number: 1, title: "Delivery", icon: MapPin },
  { number: 2, title: "Payment", icon: CreditCard },
  { number: 3, title: "Review", icon: Package },
];

const CheckoutPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = cartItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.quantityKg,
    0,
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentUI, setPaymentUI] = useState<"card" | "cod">("card");
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<CheckoutFormData>({
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
      paymentMethod: "card",
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

  // ── Auto-populate from localStorage auth_user ──────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.fullName)
        setValue("fullName", user.fullName, { shouldValidate: false });
      if (user?.email) setValue("email", user.email, { shouldValidate: false });
    } catch {}
  }, [setValue]);

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
    }
    if (currentStep === 2) {
      const valid = await trigger(["paymentMethod"], { shouldFocus: true });
      if (!valid) return;
    }
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantityKg,
        })),
        shippingAddress: {
          city: data.city,
          street: data.address,
          postalCode: data.postalCode,
          deliveryNotes: data.deliveryNotes,
        },
        customer: {
          firstName: data.fullName.trim(),
          email: data.email,
          phone: to254(data.phone),
        },
        paymentMethod: data.paymentMethod,
      };

      const orderRes = await createOrder(orderPayload);
      const orderId = orderRes.data.order.id;

      // ── Cash on Delivery ────────────────────────────────────────────────────
      // Pass method=cod so the success page renders the COD-specific variant
      if (data.paymentMethod === "cod") {
        dispatch(clearCart());
        toast.success("Order placed! Pay when we arrive.");
        window.location.href = `/orders/success?orderId=${orderId}&method=cod`;
        return;
      }

      // ── Paystack (card + M-Pesa) ────────────────────────────────────────────
      if (data.paymentMethod === "card") {
        const initRes = await initializePaystackPayment(orderId);
        const { authorizationUrl } = initRes.data;
        // Store so success page can resolve the orderId after Paystack redirects back
        localStorage.setItem("pending_order_id", orderId);
        window.location.href = authorizationUrl;
        return;
      }
    } catch (err: any) {
      const message = err?.message?.includes("{")
        ? (JSON.parse(err.message)?.message ?? "Order failed. Try again.")
        : (err?.message ?? "Order failed. Try again.");
      toast.error(message);
      setClicked(false);
    }
  };

  const inputCls = (hasErr?: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200
     ${
       hasErr
         ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
         : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/8"
     }`;

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors duration-150 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Cart
          </Link>

          {/* Step pills */}
          <div className="flex items-center gap-1 text-xs">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const done = currentStep > step.number;
              const active = currentStep === step.number;
              return (
                <div key={step.number} className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => done && setCurrentStep(step.number)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-200
                      ${active ? "bg-black text-white" : done ? "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer" : "text-gray-400 cursor-default"}`}
                  >
                    {done ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.number}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <span className="text-gray-300 text-xs">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* ── Left: form card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* ───── STEP 1: Delivery ───── */}
            {currentStep === 1 && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Delivery information
                  </h2>
                  <p className="text-sm text-gray-400">
                    Where should we deliver your order?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Full name *
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      className={inputCls(!!errors.fullName)}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Phone number *
                    </label>
                    <div className="flex">
                      <span className="flex items-center px-3.5 text-sm text-gray-500 font-medium bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl whitespace-nowrap">
                        +254
                      </span>
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
                        className={`flex-1 px-4 py-3 rounded-r-xl border text-sm outline-none transition-all duration-200
                          ${errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-black focus:ring-2 focus:ring-black/8"}`}
                        placeholder="712 345 678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Email address *
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={inputCls(!!errors.email)}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Street address *
                    </label>
                    <input
                      type="text"
                      {...register("address")}
                      className={inputCls(!!errors.address)}
                      placeholder="Street, building, floor / apartment"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className={inputCls(!!errors.city)}
                      placeholder="Nairobi"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Postal code
                    </label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className={inputCls()}
                      placeholder="00100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Delivery notes{" "}
                      <span className="normal-case font-normal text-gray-400 tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      {...register("deliveryNotes")}
                      rows={3}
                      className={inputCls() + " resize-none"}
                      placeholder="Gate code, landmark, special instructions…"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ───── STEP 2: Payment ───── */}
            {currentStep === 2 && (
              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Payment method
                  </h2>
                  <p className="text-sm text-gray-400">
                    Choose how you'd like to pay
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Paystack */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-150
                    ${paymentUI === "card" ? "border-black bg-gray-50/70" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      value="card"
                      {...register("paymentMethod")}
                      checked={paymentUI === "card"}
                      onChange={() => {
                        setPaymentUI("card");
                        setValue("paymentMethod", "card");
                      }}
                      className="mt-1 cursor-pointer accent-black"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          Pay with M-Pesa or Card
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Securely via Paystack — M-Pesa, Visa, Mastercard & more
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center text-white font-bold text-[8px]">
                          M-P
                        </div>
                        <div className="w-8 h-5 bg-blue-600 rounded" />
                        <div className="w-8 h-5 bg-red-500 rounded" />
                      </div>
                      <span className="text-[10px] text-gray-400">
                        via Paystack
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-150
                    ${paymentUI === "cod" ? "border-amber-500 bg-amber-50/60" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <input
                      type="radio"
                      value="cod"
                      {...register("paymentMethod")}
                      checked={paymentUI === "cod"}
                      onChange={() => {
                        setPaymentUI("cod");
                        setValue("paymentMethod", "cod");
                      }}
                      className="mt-1 cursor-pointer accent-amber-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        Cash on Delivery
                      </div>
                      <p className="text-xs text-gray-500">
                        Pay in cash when your order arrives
                      </p>
                    </div>
                    <div className="w-9 h-9 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M6 12h.01M18 12h.01" />
                      </svg>
                    </div>
                  </label>

                  {/* COD info note */}
                  {paymentUI === "cod" && (
                    <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"
                        />
                      </svg>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Please have the exact amount ready when your order
                        arrives. Our rider will provide a receipt on delivery.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ───── STEP 3: Review ───── */}
            {currentStep === 3 && (
              <div className="p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Review your order
                  </h2>
                  <p className="text-sm text-gray-400">
                    Confirm everything looks right
                  </p>
                </div>

                {/* Delivery summary */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Delivery information
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2 cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="px-4 py-3.5 space-y-1 text-sm">
                    <p className="font-semibold text-gray-800">
                      {getValues("fullName")}
                    </p>
                    <p className="text-gray-500">
                      {getValues("email")} · +254 {getValues("phone")}
                    </p>
                    <p className="text-gray-500">
                      {getValues("address")}, {getValues("city")}
                      {getValues("postalCode")
                        ? ` ${getValues("postalCode")}`
                        : ""}
                    </p>
                    {getValues("deliveryNotes") && (
                      <p className="text-gray-400 italic text-xs">
                        "{getValues("deliveryNotes")}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment summary */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Payment method
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-2 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="px-4 py-3.5 flex items-center gap-3">
                    {paymentMethod === "cod" ? (
                      <>
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.8}
                          >
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-amber-600 font-medium">
                            Pay when your order arrives
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-1">
                          <div className="w-7 h-5 bg-green-600 rounded text-white text-[8px] font-bold flex items-center justify-center">
                            M-P
                          </div>
                          <div className="w-7 h-5 bg-blue-600 rounded" />
                          <div className="w-7 h-5 bg-red-500 rounded" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            M-Pesa or Card
                          </p>
                          <p className="text-xs text-gray-400">via Paystack</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-700">
                    <Package className="w-4 h-4 text-gray-400" />
                    Order items ({cartItems.length})
                  </div>
                  <div className="px-4 py-2 divide-y divide-gray-50">
                    {cartItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2.5 text-sm"
                      >
                        <span className="text-gray-600">
                          {item.name}{" "}
                          <span className="text-gray-400">
                            × {item.quantityKg}kg
                          </span>
                        </span>
                        <span className="font-semibold text-gray-800">
                          KSh{" "}
                          {(item.pricePerKg * item.quantityKg).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-150 cursor-pointer">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    {...register("agreeToTerms")}
                    className="mt-0.5 w-4 h-4 accent-black cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-500 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-black underline underline-offset-2 hover:text-gray-600"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-black underline underline-offset-2 hover:text-gray-600"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-xs -mt-3 ml-1">
                    {String(errors.agreeToTerms.message)}
                  </p>
                )}
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex gap-3 pt-5 border-t border-gray-50">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 px-6 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-900 active:scale-[0.99] transition-all duration-150 shadow-sm cursor-pointer"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={clicked}
                    onClick={() => {
                      if (clicked) return;
                      setClicked(true);
                      handleSubmit(onSubmit, (errs) => {
                        console.log("VALIDATION ERRORS:", errs);
                        setClicked(false);
                      })();
                      setTimeout(() => setClicked(false), 4000);
                    }}
                    className={`flex-1 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-150 shadow-sm flex items-center justify-center gap-2
                      ${
                        clicked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : paymentUI === "cod"
                            ? "bg-amber-500 hover:bg-amber-600 text-white active:scale-[0.99] cursor-pointer"
                            : "bg-green-600 hover:bg-green-700 text-white active:scale-[0.99] cursor-pointer"
                      }`}
                  >
                    {clicked ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
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
                        Placing order…
                      </>
                    ) : paymentUI === "cod" ? (
                      "Confirm order · Pay on delivery"
                    ) : (
                      "Place order · Pay with Paystack"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-bold text-gray-900">
                  Order summary
                </h3>
              </div>
              <div className="px-5 py-4">
                <div className="space-y-2.5 pb-4 border-b border-gray-50">
                  {cartItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start text-sm"
                    >
                      <span className="text-gray-600 leading-tight">
                        {item.name}
                        <br />
                        <span className="text-xs text-gray-400">
                          {item.quantityKg}kg
                        </span>
                      </span>
                      <span className="font-medium text-gray-800 ml-4 flex-shrink-0">
                        KSh{" "}
                        {(item.pricePerKg * item.quantityKg).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="py-4 space-y-2 border-b border-gray-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-700">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-50 space-y-2.5">
                {[
                  "Secure SSL checkout",
                  "Same-day delivery",
                  "100% quality guarantee",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2.5 text-xs text-gray-500"
                  >
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-green-600" />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              Step {currentStep} of {steps.length} ·{" "}
              {currentStep === 1
                ? "Delivery details"
                : currentStep === 2
                  ? "Choose payment"
                  : "Review & confirm"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
