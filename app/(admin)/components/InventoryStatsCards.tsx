import { Product } from "@/types/product";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";
interface StatsCardProp {
  inventory: Product[];
}

const minStock = 10;

function InventoryStatsCards({ inventory }: StatsCardProp) {
  const lowStockItems = inventory.filter(
    (item) => item.stockkg <= minStock && item.stockkg > 0
  );
  const outOfStockItems = inventory.filter((item) => item.stockkg === 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">
              {inventory.length}
            </p>
          </div>
          <Package className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600">
              {inventory.filter((i) => i.stockkg > minStock).length}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {outOfStockItems.length}
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
    </div>
  );
}

export default InventoryStatsCards;
