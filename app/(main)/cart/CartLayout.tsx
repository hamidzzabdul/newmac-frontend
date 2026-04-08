"use client";
import { ArrowLeft } from "lucide-react";
import CartItem from "@/app/(main)/cart/CartItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/UseAuth";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

const CartLayout = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { isSignedIn, loading, login } = useAuth(); // 👈
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const total = cartItems.reduce(
    (total: number, item) => total + item.pricePerKg * item.quantityKg,
    0,
  );

  const handleCheckout = () => {
    if (loading) return; // wait for auth to resolve
    if (isSignedIn) {
      router.push("/checkout");
    } else {
      setAuthModalOpen(true);
    }
  };
  return (
    <div className="w-[90%] m-auto mt-10 min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
        onLoginSuccess={(userData) => {
          login(userData);
          setAuthModalOpen(false);
          router.push("/checkout"); // 👈 proceed after login
        }}
      />

      {/* Header */}
      <div className="bg-white border-b border-b-gray-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
              <ArrowLeft size={22} />
              <span className="font-semibold">Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Flex Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Cart Items (Flex: 2) */}
          <div className="flex-2 flex flex-col gap-4">
            {/* Cart Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Cart Items ({cartItems.length})
              </h2>
              <button className="text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition">
                Clear Cart
              </button>
            </div>

            {/* Cart Items - Flex Column */}
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <div className="" key={item.id}>
                  <CartItem product={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Order Summary (Flex: 1) */}
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-red-600 rounded"></span>
                Order Summary
              </h2>

              {/* Summary Items - Flex Column */}
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-red-600">
                  KSh {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button - UPDATED */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-md hover:shadow-lg mb-4 px-4 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Loading..." : "Proceed to Checkout"}
              </button>

              {/* Trust Badges - Flex */}
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Fresh Quality
                    </p>
                    <p className="text-xs text-gray-500">100% guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 text-xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Fast Delivery
                    </p>
                    <p className="text-xs text-gray-500">Same day available</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-purple-600 text-xl">🔒</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Secure Payment
                    </p>
                    <p className="text-xs text-gray-500">Multiple options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartLayout;
