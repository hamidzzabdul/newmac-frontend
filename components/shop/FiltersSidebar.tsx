import { Search } from "lucide-react";

interface FiltersSidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showInStock: boolean;
  setShowInStock: (inStock: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  showInStock,
  setShowInStock,
  searchQuery,
  setSearchQuery,
  clearFilters,
}) => {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? "bg-red-600 text-white font-semibold"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              In Stock Only
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
