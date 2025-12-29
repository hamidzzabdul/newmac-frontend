"use client";

import { useState, useMemo } from "react";
import ProductInfo from "@/components/shop/ProductInfo";
import RelatedProducts from "@/components/shop/RelatedProducts";
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "@/app/store/features/CartSlice";
import { useParams, useRouter } from "next/navigation";

// Sample product data
const allProducts = [
  {
    id: "1",
    name: "Prime Beef Steak",
    category: "Beef",
    pricePerKg: 850,
    weight: "1kg",
    image: "/products/beef-1.jpg",
    inStock: true,
  },
  {
    id: "2",
    name: "Beef Ribs",
    category: "Beef",
    pricePerKg: 750,
    weight: "1kg",
    image: "/products/beef-2.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "Ground Beef",
    category: "Beef",
    pricePerKg: 600,
    weight: "1kg",
    image: "/products/beef-3.jpg",
    inStock: true,
  },
  // add more products...
];

const ProductPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const product = allProducts.find((p) => p.id === id);

  const dispatch = useDispatch();
  const addToCart = (product, quantity) =>
    dispatch(addToCartAction({ product, quantity }));

  const [quantity, setQuantity] = useState(1);

  // Related products (same category)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [product]);

  if (!product) return <p className="text-center py-20">Product not found</p>;

  return (
    <div className="max-w-7xl sm:max-w-5xl lg:max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 border border-gray-200 shadow-lg">
          {/* <ProductGallery images={[product.image]} /> */}
        </div>
        <div className="lg:w-1/2">
          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            addToCart={addToCart}
          />
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductPage;
