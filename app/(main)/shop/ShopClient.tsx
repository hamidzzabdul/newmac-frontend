"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import FiltersSidebar from "@/components/shop/FiltersSidebar";
import ProductsGrid from "@/components/ProductGrid";
import NoProductsFound from "@/components/NoProductsFound";
import Pagination from "@/components/shop/Pagination";
import { Product } from "@/types/product";

interface ShopClientProps {
  products: Product[];
  totalPages: number;
  totalResults: number;
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialInStock: boolean;
  initialPage: number;
}

const categories = ["All", "beef", "goat", "lamb", "chicken", "camel"];

export default function ShopClient({
  products,
  totalPages,
  totalResults,
  initialSearch,
  initialCategory,
  initialInStock,
  initialPage,
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileSearch, setMobileSearch] = useState(initialSearch);

  useEffect(() => {
    setMobileSearch(initialSearch);
  }, [initialSearch]);

  const pushParams = (params: URLSearchParams) => {
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url);
  };

  const updateQuery = (key: string, value: string | boolean | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      value === "" ||
      value === false ||
      value === "All" ||
      value === "default" ||
      value === null ||
      value === undefined
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    pushParams(params);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const handlePageChange = (page: number) => {
    const safePage = Number(page);
    if (!Number.isFinite(safePage) || safePage < 1) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(safePage));
    pushParams(params);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const trimmedLocal = mobileSearch.trim();
    const trimmedInitial = initialSearch.trim();

    if (trimmedLocal === trimmedInitial) return;

    const timer = setTimeout(() => {
      updateQuery("search", trimmedLocal);
    }, 400);

    return () => clearTimeout(timer);
  }, [mobileSearch, initialSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Desktop sidebar */}
        <FiltersSidebar
          categories={categories}
          selectedCategory={initialCategory}
          setSelectedCategory={(category) => updateQuery("category", category)}
          showInStock={initialInStock}
          setShowInStock={(checked) => updateQuery("inStock", checked)}
          searchQuery={initialSearch}
          setSearchQuery={(query) => updateQuery("search", query)}
          clearFilters={clearFilters}
        />

        <main className="flex-1">
          {/* Mobile search + categories */}
          <div className="lg:hidden mb-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateQuery("category", category)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    initialCategory === category
                      ? "bg-red-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-xl px-4 py-3">
              <input
                type="checkbox"
                checked={initialInStock}
                onChange={(e) => updateQuery("inStock", e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-gray-700">
                In Stock Only
              </span>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>

          {/* Simple top info */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {initialCategory === "All"
                ? "All Products"
                : `${initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)} Products`}
            </h1>
            <p className="text-gray-600">
              Showing {products.length} of {totalResults} products
              {initialSearch ? ` for "${initialSearch}"` : ""}
            </p>
          </div>

          {products.length > 0 ? (
            <>
              <ProductsGrid products={products} />
              <Pagination
                currentPage={initialPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <NoProductsFound clearFilters={clearFilters} />
          )}
        </main>
      </div>
    </div>
  );
}
