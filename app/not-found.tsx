"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-600 to-red-800 leading-none select-none">
              404
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off. It might
            have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Illustration or Icon */}
        <div className="mb-10 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Search className="w-16 h-16 text-red-600" strokeWidth={2} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Go Back Home
          </Link>

          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Browse Products
          </Link>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Return to previous page</span>
        </button>

        {/* Quick Links */}
        <div className="pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-red-200 rounded-full blur-2xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 bg-red-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
}
