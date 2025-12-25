import React from "react";
import { ArrowLeft } from "lucide-react";
import CartItem from "@/app/cart/CartItem";

// Dummy cart data
const dummyCartItems = [
  {
    id: 1,
    name: "Premium Beef Steak",
    category: "Beef",
    price: 800,
    quantity: 2,
    weight: "500g",
    image:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Chicken Breast Fillet",
    category: "Chicken",
    price: 450,
    quantity: 1,
    weight: "1kg",
    image:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
  },
];

// Cart Page Component with Flex Design
const CartLayout = () => {
  const subtotal = dummyCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-[90%] m-auto mt-10 min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-b-gray-300  sticky top-0 z-10 ">
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
                Cart Items ({dummyCartItems.length})
              </h2>
              <button className="text-sm font-medium text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition">
                Clear Cart
              </button>
            </div>

            {/* Cart Items - Flex Column */}
            <div className="flex flex-col gap-3">
              {dummyCartItems.map((item) => (
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
                    KSh {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {deliveryFee === 0 ? "FREE" : `KSh ${deliveryFee}`}
                  </span>
                </div>

                {deliveryFee === 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <span>🎉</span>
                    <span className="font-medium">
                      You&apos;ve unlocked free delivery!
                    </span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Add{" "}
                    <span className="font-semibold text-red-600">
                      KSh {(5000 - subtotal).toLocaleString()}
                    </span>{" "}
                    more for free delivery
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-red-600">
                  KSh {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-md hover:shadow-lg mb-4">
                Proceed to Checkout
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
