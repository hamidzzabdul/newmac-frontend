"use client";

import { useState, useMemo, useEffect } from "react";
import FiltersSidebar from "@/components/shop/FiltersSidebar";
import MobileFiltersDrawer from "@/components/shop/MobileFiltersDrawer";
import ProductsHeader from "@/components/ProductHeader";
import ProductsGrid from "@/components/ProductGrid";
import NoProductsFound from "@/components/NoProductsFound";
import Pagination from "@/components/shop/Pagination";
import { Product } from "@/types/product";

interface ShopClientProps {
  products: Product[];
}

const categories = ["All", "beef", "goat", "lamb", "chicken", "camel"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KSh 500", min: 0, max: 500 },
  { label: "KSh 500 - 800", min: 500, max: 800 },
  { label: "KSh 800 - 1000", min: 800, max: 1000 },
  { label: "Above KSh 1000", min: 1000, max: Infinity },
];

const ITEMS_PER_PAGE = 12;

export default function ShopClient({ products }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (showInStock) {
      filtered = filtered.filter((p) => p.stockkg > 0);
    }

    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.pricePerKg - b.pricePerKg);
    }

    if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.pricePerKg - a.pricePerKg);
    }

    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, showInStock]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    const id = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(id);
  }, [searchQuery, selectedCategory, sortBy, showInStock]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange(0);
    setSortBy("default");
    setShowInStock(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <FiltersSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          showInStock={showInStock}
          setShowInStock={setShowInStock}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearFilters={clearFilters}
        />
        <MobileFiltersDrawer
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRanges={priceRanges}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          showInStock={showInStock}
          setShowInStock={setShowInStock}
          clearFilters={clearFilters}
        />
        <main className="flex-1">
          <ProductsHeader
            filteredProducts={filteredProducts}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          {filteredProducts.length > 0 ? (
            <>
              <ProductsGrid products={currentProducts} />
              <Pagination
                currentPage={currentPage}
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
