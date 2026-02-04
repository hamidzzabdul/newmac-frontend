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
  const imageSrc = getImageUrl(product.images?.[0] || "");
  const addToCart = () => {
    dispatch(
      addToCartAction({
        id: product._id,
        name: product.name,
        pricePerKg: product.pricePerKg,
        image: imageSrc,
        category: product.category,
        quantityKg: quantity,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  const [quantity, setQuantity] = useState(1);

  if (!product) return <ErrorProductNotFound />;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb (Optional - add if you have breadcrumb data) */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li className="text-gray-400 font-medium cursor-pointer hover:text-red-500 duration-300 transition">
              <Link href="/">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-400 font-medium cursor-pointer hover:text-red-500 duration-300 transition">
              <Link href="/shop">Shop</Link>
            </li>
            <li>/</li>
            <li className="text-gray-00 font-medium ">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Product Gallery */}
          <div>
            <ProductGallery
              images={product.images?.map((img) => getImageUrl(img)) || []}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              addToCart={addToCart}
            />
          </div>
        </div>

        {/* Additional Product Details Section */}
        <div className="mt-16 lg:mt-24">
          <div className="border-t border-gray-200 pt-12">
            {/* Tabs or Accordion for Description, Specifications, Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* You can add product description, specs, reviews here */}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 lg:mt-24">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
