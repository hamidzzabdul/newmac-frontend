import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="w-[90%] mx-auto mt-10 min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-b-gray-300  sticky top-0 z-10 ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
            <ArrowLeft size={22} />
            <span className="font-semibold">Back to Shop</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package size={64} className="text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Discover our premium selection of fresh meat products!
          </p>
          <Link href={"/shop"}>
            <button className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-md hover:shadow-lg">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
