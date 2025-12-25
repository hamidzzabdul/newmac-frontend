import { dummyProducts } from "@/services/data";
import ProductItem from "./ProductItem";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function Product() {
  return (
    <section className="py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-full mb-4">
            FRESH SELECTION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop Our <span className="text-red-600">Premium Meats</span>
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl w-2/4 mx-auto">
            Explore our fresh variety of premium quality meats, sourced from
            trusted suppliers and delivered straight to your door
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {dummyProducts.map((item) => (
            <ProductItem key={item.id} product={item} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View All Products
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Product;
