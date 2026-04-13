import { Product, ProductCategory } from "@/types/product";

type InventoryFormData = Partial<Product> & {
  sku?: string;
  category?: ProductCategory;
};

interface InventoryFormProps {
  formData: InventoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<InventoryFormData>>;
  onCancel: () => void;
  onSubmit: () => void;
  isEditMode: boolean;
}

export default function InventoryForm({
  formData,
  setFormData,
  onCancel,
  onSubmit,
  isEditMode,
}: InventoryFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU
          </label>
          <input
            type="text"
            value={formData.sku || ""}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as Product["category"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="beef">Beef</option>
            <option value="chicken">Chicken</option>
            <option value="goat">Goat</option>
            <option value="lamb">Lamb</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Quantity (stockkg) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity (kg)
          </label>
          <input
            type="number"
            value={formData.stockkg || 0}
            onChange={(e) =>
              setFormData({ ...formData, stockkg: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
        </div>

        {/* Price per Kg */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (KSh)
          </label>
          <input
            type="number"
            value={formData.pricePerKg || 0}
            onChange={(e) =>
              setFormData({ ...formData, pricePerKg: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={0}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          {isEditMode ? "Update Product" : "Add Product"}
        </button>
      </div>
    </>
  );
}
