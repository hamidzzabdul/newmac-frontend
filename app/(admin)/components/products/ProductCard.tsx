import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onDeleteClick?: (product: Product) => void;
  isDeleting?: boolean;
}

const ProductCard = ({
  product,
  onDeleteClick,
  isDeleting = false,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.images[0]}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          {product.stockkg === 0 ? (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          ) : product.stockkg <= 10 ? (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Low Stock
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              In Stock
            </span>
          )}
        </div>

        {product.featured && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          </div>
        )}

        {product.onSale && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
              ON SALE
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-600">SKU: {product.sku}</p>
          <span className="text-xs text-gray-400">•</span>
          <p className="text-xs text-gray-600 capitalize">{product.category}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              KSh {product.pricePerKg?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Stock: {product.stockkg} kg</p>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/products/edit/${product._id}`}>
              <button
                type="button"
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="Edit product"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </Link>

            <button
              type="button"
              disabled={isDeleting}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              title="Delete product"
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick?.(product);
              }}
            >
              {isDeleting ? (
                <span className="block h-4 w-4 rounded-full border-2 border-red-300 border-t-red-600 animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
