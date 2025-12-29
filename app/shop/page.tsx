"use client";

import { useState, useMemo } from "react";
import HeroSection from "@/components/shop/HeroSection";
import FiltersSidebar from "@/components/shop/FiltersSidebar";
import MobileFiltersDrawer from "@/components/shop/MobileFiltersDrawer";
import ProductsHeader from "@/components/ProductHeader";
import ProductsGrid from "@/components/ProductGrid";
import NoProductsFound from "@/components/NoProductsFound";

// Sample product data
const allProducts = [
  {
    id: "1",
    name: "Prime Beef Steak",
    category: "Beef",
    pricePerKg: 850,
    image: "/products/beef-1.jpg",
    inStock: true,
  },
  {
    id: "2",
    name: "Beef Ribs",
    category: "Beef",
    pricePerKg: 750,
    image: "/products/beef-2.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "Ground Beef",
    category: "Beef",
    pricePerKg: 600,
    image: "/products/beef-3.jpg",
    inStock: true,
  },
  {
    id: "4",
    name: "Goat Chops",
    category: "Goat",
    pricePerKg: 900,
    image: "/products/goat-1.jpg",
    inStock: true,
  },
  {
    id: "5",
    name: "Goat Leg",
    category: "Goat",
    pricePerKg: 850,
    image: "/products/goat-2.jpg",
    inStock: false,
  },
  {
    id: "6",
    name: "Lamb Rack",
    category: "Lamb",
    pricePerKg: 1200,
    image: "/products/lamb-1.jpg",
    inStock: true,
  },
  {
    id: "7",
    name: "Lamb Shoulder",
    category: "Lamb",
    pricePerKg: 950,
    image: "/products/lamb-2.jpg",
    inStock: true,
  },
  {
    id: "8",
    name: "Whole Chicken",
    category: "Chicken",
    pricePerKg: 450,
    image: "/products/chicken-1.jpg",
    inStock: true,
  },
  {
    id: "9",
    name: "Chicken Breast",
    category: "Chicken",
    pricePerKg: 550,
    image: "/products/chicken-2.jpg",
    inStock: true,
  },
  {
    id: "10",
    name: "Camel Steak",
    category: "Camel",
    pricePerKg: 800,
    image: "/products/camel-1.jpg",
    inStock: true,
  },
];

const categories = ["All", "Beef", "Goat", "Lamb", "Chicken", "Camel"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KSh 500", min: 0, max: 500 },
  { label: "KSh 500 - 800", min: 500, max: 800 },
  { label: "KSh 800 - 1000", min: 800, max: 1000 },
  { label: "Above KSh 1000", min: 1000, max: Infinity },
];

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [showInStock, setShowInStock] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (searchQuery)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (selectedCategory !== "All")
      filtered = filtered.filter((p) => p.category === selectedCategory);

    const range = priceRanges[selectedPriceRange];
    filtered = filtered.filter(
      (p) => p.pricePerKg >= range.min && p.pricePerKg <= range.max
    );

    if (showInStock) filtered = filtered.filter((p) => p.inStock);

    if (sortBy === "price-low")
      filtered = [...filtered].sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sortBy === "price-high")
      filtered = [...filtered].sort((a, b) => b.pricePerKg - a.pricePerKg);
    if (sortBy === "name")
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, showInStock]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPriceRange(0);
    setSortBy("default");
    setShowInStock(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        <FiltersSidebar
          categories={categories}
          priceRanges={priceRanges}
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
            <ProductsGrid products={filteredProducts} />
          ) : (
            <NoProductsFound clearFilters={clearFilters} />
          )}
        </main>
      </div>
    </div>
  );
}
