"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import Product from "@/components/Product";
import { Product as ProductType } from "@/types/product";

interface HomeProductsSectionProps {
  products: ProductType[];
}

const categories = [
  { id: 1, name: "Beef" },
  { id: 2, name: "Goat" },
  { id: 3, name: "Lamb" },
];

export default function HomeProductsSection({
  products,
}: HomeProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery]);

  return (
    <section className="md:w-[95%] max-w-350 mx-auto py-10 md:py-14">
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Shop Our Premium Selection
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Discover our carefully curated selection of premium halal meats,
          sourced with care and delivered fresh to your doorstep.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search beef, goat, lamb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <>
          {categories.map((cat) => (
            <Product key={cat.id} category={cat} products={filteredProducts} />
          ))}

          <div className="text-center mt-6 md:mt-8">
            <Link
              href={
                searchQuery.trim()
                  ? `/shop?search=${encodeURIComponent(searchQuery.trim())}`
                  : "/shop"
              }
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            >
              View All Products
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="text-gray-600 text-lg mb-4">
            No products found for "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
}
