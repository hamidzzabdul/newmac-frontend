import { X } from "lucide-react";

interface PriceRange {
  label: string;
  min?: number;
  max?: number;
}

interface MobileFiltersDrawerProps {
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRanges: PriceRange[];
  selectedPriceRange: number | null;
  setSelectedPriceRange: React.Dispatch<React.SetStateAction<number | null>>;
  showInStock: boolean;
  setShowInStock: React.Dispatch<React.SetStateAction<boolean>>;
  clearFilters: () => void;
}

const MobileFiltersDrawer = ({
  showFilters,
  setShowFilters,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRanges,
  selectedPriceRange,
  setSelectedPriceRange,
  showInStock,
  setShowInStock,
  clearFilters,
}: MobileFiltersDrawerProps) => {
  if (!showFilters) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      selectedCategory === category
                        ? "bg-red-600 text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Price Range
              </label>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPriceRange(index)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      selectedPriceRange === index
                        ? "bg-red-600 text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={showInStock}
                onChange={(e) => setShowInStock(e.target.checked)}
                className="w-5 h-5 text-red-600"
              />
              <span className="text-sm font-semibold">In Stock Only</span>
            </label>

            <button
              onClick={clearFilters}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFiltersDrawer;
