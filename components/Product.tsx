"use client";
import ProductItem from "./ProductItem";
import Link from "next/link";
// import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Product as ProductType } from "@/types/product";

// Import Swiper styles
import "swiper/css";

type ProductProps = {
  category: {
    id: number;
    name: string;
  };
  products: ProductType[];
};

function Product({ category, products }: ProductProps) {
  const filterdProducts = products.filter(
    (product) => product.category.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <section className="py-6 w-full">
      <div className="w-full h-10 px-3 py-2 bg-red-500 flex items-center justify-between">
        <p className="text-base font-semibold text-white">{category.name}</p>
        <Link href={"/shop"} className="text-sm text-white cursor-pointer">
          See All
        </Link>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
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
        className="w-full mt-3"
      >
        {filterdProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Product;
