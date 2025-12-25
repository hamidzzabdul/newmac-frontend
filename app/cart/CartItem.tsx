import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  category: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
};

function CartItem({ product }: { product: Product }) {
  return (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4"
    >
      {/* Image */}
      <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={""}
          alt={product.name}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details - Flex Container */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded">
              {product.category}
            </span>
            <span>{product.weight}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            KSh {product.price.toLocaleString()} each
          </p>
        </div>

        {/* Quantity Controls - Flex */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-red-300 transition">
            <Minus size={16} className="text-gray-600" />
          </button>
          <span className="w-12 text-center font-bold text-gray-800">
            {product.quantity}
          </span>
          <button className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-red-300 transition">
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Price & Remove - Flex */}
        <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
          <span className="text-xl font-bold text-red-600">
            KSh {(product.price * product.quantity).toLocaleString()}
          </span>
          <button className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
