"use client";

import ProductItem from "./ProductItem";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Product as ProductType } from "@/types/product";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

type ProductProps = {
  category: {
    id: number;
    name: string;
  };
  products: ProductType[];
};

function Product({ category, products }: ProductProps) {
  const filteredProducts = products.filter((product) => {
    const productCategory =
      typeof product.category === "string"
        ? product.category
        : (product.category as { name?: string })?.name || "";

    return (
      productCategory.trim().toLowerCase() ===
      category.name.trim().toLowerCase()
    );
  });

  if (!filteredProducts.length) return null;

  return (
    <section className="py-6 w-full">
      <div className="w-full px-4 py-3 bg-red-500 flex items-center justify-between rounded-t-md shadow-sm">
        <div>
          <p className="text-base md:text-lg font-semibold text-white tracking-wide">
            {category.name}
          </p>
          <p className="text-xs text-red-100">
            Fresh premium cuts selected for you
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="text-sm text-white hover:text-red-100 transition-colors cursor-pointer"
          >
            See All
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <button
              className={`product-swiper-prev-${category.id} w-9 h-9 rounded-full border border-white/30 bg-white/10 hover:bg-white hover:text-red-500 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm`}
              aria-label={`Previous ${category.name} products`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className={`product-swiper-next-${category.id} w-9 h-9 rounded-full border border-white/30 bg-white/10 hover:bg-white hover:text-red-500 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm`}
              aria-label={`Next ${category.name} products`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mt-3 relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop={filteredProducts.length > 1}
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: `.product-swiper-prev-${category.id}`,
            nextEl: `.product-swiper-next-${category.id}`,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product._id} className="pb-2">
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <ProductItem product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="sm:hidden flex justify-center gap-3 mt-4">
          <button
            className={`product-swiper-prev-${category.id} w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm`}
            aria-label={`Previous ${category.name} products mobile`}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            className={`product-swiper-next-${category.id} w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-sm`}
            aria-label={`Next ${category.name} products mobile`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Product;
