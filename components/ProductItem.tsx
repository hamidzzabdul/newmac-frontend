"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/store/features/CartSlice";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Product as ProductType } from "@/types/product";
import { getImageUrl } from "@/utils/image";

type ProductProps = {
  product: ProductType;
};

const ProductItem = ({ product }: ProductProps) => {
  const inStock = product.stockkg > 0;
  const dispatch = useDispatch();
  const imageSrc = getImageUrl(product.images?.[0] || "");
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        quantityKg: 1,
        image: imageSrc,
        category: product.category,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="w-full group  md:h-80 overflow-hidden">
      <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <Link href={`/shop/${product._id}`}>
          <div className="relative w-full h-100 md:h-48  overflow-hidden cursor-pointer">
            {/* Image layer */}
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              unoptimized
              className="object-contain lg:object-cover z-0 transition-transform duration-500 group-hover:scale-110"
            />

            {/* Category Badge */}
            <div className="absolute top-3 left-3 z-20">
              <span className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-full shadow-md uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            {/* Out of Stock Overlay */}
            {!inStock && (
              <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                <span className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Quick Add Overlay */}
            {inStock && (
              <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white hover:bg-red-600 text-red-600 hover:text-white p-3 rounded-full shadow-lg active:scale-95"
                >
                  <ShoppingCart size={24} />
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <Link href={`/shop/${product._id}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight hover:text-red-600 transition-colors cursor-pointer min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-red-600">
                KSh {product.pricePerKg.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">/kg</span>
            </div>

            {/* Icon-only Cart Button */}
            <button
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`p-2.5 rounded-full transition-all duration-300 active:scale-95
                ${
                  inStock
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
