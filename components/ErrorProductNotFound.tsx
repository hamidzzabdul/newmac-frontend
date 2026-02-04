import Link from "next/link";
import { SearchX, Home, ArrowLeft, Package } from "lucide-react";

const ErrorProductNotFound = () => {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <SearchX className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-4">
          <span className="text-6xl font-bold text-gray-300">404</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Product Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the product you're looking for. It may have
          been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            <Package className="w-5 h-5" />
            Browse Products
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {/* Go Back Option */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go back to previous page</span>
        </button>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-red-600 hover:text-red-700 font-medium cursor-pointer underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorProductNotFound;
