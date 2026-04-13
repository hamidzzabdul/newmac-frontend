"use client";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck, Award } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative min-h-162.5 md:min-h-180 xl:min-h-195"
        style={{
          backgroundImage: "url('/homepage/hero2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40" />

        {/* Content */}
        <div className="relative h-full">
          <div className="mx-auto flex min-h-162.5 md:min-h-180 xl:min-h-195 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-6 md:space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/50 bg-red-600/20 px-4 py-2 backdrop-blur-sm">
                <Award size={18} className="text-red-500" />
                <span className="text-sm font-semibold text-red-400">
                  Quality Meat You Can Trust
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  Welcome to <span className="text-red-500">NewMark</span>
                </h1>
                <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  Online Butchery
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg md:text-xl">
                Order premium beef, goat &amp; lamb online and get it delivered
                fresh to your door. Same-day delivery available in Nairobi.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <Link href="/shop" className="w-full sm:w-auto">
                  <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-red-500/50 cursor-pointer">
                    <ShoppingCart size={20} />
                    Shop Now
                    <ArrowRight
                      size={20}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <button className="w-full rounded-lg border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 cursor-pointer">
                    Learn More
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-5 border-t border-white/20 pt-6 md:gap-6 md:pt-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-600/20 p-2">
                    <Truck size={24} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Same Day</p>
                    <p className="text-xs text-gray-400">Delivery</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-600/20 p-2">
                    <Award size={24} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Premium</p>
                    <p className="text-xs text-gray-400">Quality</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-600/20 p-2">
                    <svg
                      className="h-6 w-6 text-red-500"
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
                    <p className="text-sm font-semibold text-white">100%</p>
                    <p className="text-xs text-gray-400">Fresh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
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
    </section>
  );
};

export default Hero;
