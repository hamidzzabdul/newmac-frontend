import { ChevronDown } from "lucide-react";

const ProductsHeader = ({
  filteredProducts,
  searchQuery,
  selectedCategory,
  sortBy,
  setSortBy,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h2 className="text-base font-bold text-gray-900">
        Showing {filteredProducts.length} Products
      </h2>
      {(searchQuery || selectedCategory !== "All") && (
        <p className="text-gray-600 text-sm mt-1">
          {searchQuery && `Searching for "${searchQuery}"`}
          {searchQuery && selectedCategory !== "All" && " in "}
          {selectedCategory !== "All" && selectedCategory}
        </p>
      )}
    </div>

    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-semibold cursor-pointer text-xs"
      >
        <option value="default">Sort By: Default</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
    </div>
  </div>
);

export default ProductsHeader;
