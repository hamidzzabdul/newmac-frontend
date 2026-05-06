"use client";

import { useState } from "react";
import ProductInfo from "@/components/shop/ProductInfo";
import RelatedProducts from "@/components/shop/RelatedProducts";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/app/store/features/CartSlice";
import { Product } from "@/types/product";
import ProductGallery from "@/components/shop/ProductGallery";
import { getImageUrl } from "@/utils/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ErrorProductNotFound from "@/components/ErrorProductNotFound";

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductClient = ({ product, relatedProducts }: ProductClientProps) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return <ErrorProductNotFound />;

  const imageSrc = getImageUrl(product.images?.[0] || "");

  const selectedTotalPrice = product.pricePerKg * quantity;

  const addToCart = () => {
    dispatch(
      addToCartAction({
        id: product._id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        image: imageSrc,
        category: product.category,
        quantityKg: quantity,
      }),
    );

    toast.success(
      `${product.name} (${quantity === 0.5 ? "½ kg" : `${quantity} kg`}) added to cart!`,
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li className="cursor-pointer font-medium text-gray-400 transition duration-300 hover:text-red-500">
              <Link href="/">Home</Link>
            </li>
            <li>/</li>
            <li className="cursor-pointer font-medium text-gray-400 transition duration-300 hover:text-red-500">
              <Link href="/shop">Shop</Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div>
            <ProductGallery
              images={product.images?.map((img) => getImageUrl(img)) || []}
            />
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedTotalPrice={selectedTotalPrice}
              addToCart={addToCart}
            />
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="border-t border-gray-200 pt-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"></div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
