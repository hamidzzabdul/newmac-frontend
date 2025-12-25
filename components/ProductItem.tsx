import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  image: string;
  inStock?: boolean;
};

const ProductItem = ({ product }: { product: Product }) => {
  const inStock = product.inStock !== false;

  return (
    <div className="w-full group">
      <div className="w-full overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden cursor-pointer">
            <Image
              src={product.image || "/placeholder-meat.jpg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Category */}
            <div className="absolute top-2 left-2">
              <span className="px-2.5 py-1 text-[10px] font-semibold text-white bg-red-600 tracking-wide">
                {product.category}
              </span>
            </div>

            {/* Stock */}
            {!inStock && (
              <div className="absolute top-2 right-2">
                <span className="px-2.5 py-1 text-[10px] font-semibold text-white bg-gray-800 tracking-wide">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight hover:text-red-600 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold text-red-600">
              KSh {product.pricePerKg.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/kg</span>
          </div>

          <button
            disabled={!inStock}
            className={`w-full mt-2 py-1.5 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${
                inStock
                  ? "bg-red-600 hover:bg-red-700 text-white active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
