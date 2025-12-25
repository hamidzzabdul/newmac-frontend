"use client";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck, Award } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Hero Section */}
      <div
        className="w-full h-[600px] md:h-[700px] relative"
        style={{
          backgroundImage: "url('/homepage/hero2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>

        {/* Content Container */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="w-full md:w-2/3 lg:w-1/2 space-y-6 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-full backdrop-blur-sm">
              <Award size={18} className="text-red-500" />
              <span className="text-sm font-semibold text-red-400">
                Quality Meat You Can Trust
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to <span className="text-red-500">NewMac</span>
              <br />
              Online Butchery
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
              Order premium beef, goat & lamb online and get it delivered fresh
              to your door. Same-day delivery available in Nairobi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/shop">
                <button className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50 hover:scale-105">
                  <ShoppingCart size={20} />
                  Shop Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>

              <Link href="/about">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Truck size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Same Day</p>
                  <p className="text-gray-400 text-xs">Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Award size={24} className="text-red-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Premium</p>
                  <p className="text-gray-400 text-xs">Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">100%</p>
                  <p className="text-gray-400 text-xs">Fresh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Strip */}
      <div className="w-full bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-600 transition-colors">
                <Truck
                  size={28}
                  className="text-red-600 group-hover:text-white transition-colors"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Free Delivery
                </h3>
                <p className="text-gray-600 text-sm">
                  On orders above KSh 2,000 within Nairobi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-600 transition-colors">
                <Award
                  size={28}
                  className="text-red-600 group-hover:text-white transition-colors"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Premium Quality
                </h3>
                <p className="text-gray-600 text-sm">
                  Carefully selected cuts from trusted suppliers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-600 transition-colors">
                <svg
                  className="w-7 h-7 text-red-600 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Same Day Delivery
                </h3>
                <p className="text-gray-600 text-sm">
                  Order before 2 PM for same-day delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Hero;
