import { Search } from "lucide-react";

interface NoProductsFoundProps {
  clearFilters: () => void;
}

const NoProductsFound = ({ clearFilters }: NoProductsFoundProps) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-600 mb-6">
      Try adjusting your search or filter criteria
    </p>
    <button
      onClick={clearFilters}
      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
    >
      Clear Filters
    </button>
  </div>
);

export default NoProductsFound;
