import { getAllProducts, getProductById } from "@/lib/api/products";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{ id: string }>; // Notice Promise here
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params; // ✅ unwrap the promise

  const product = await getProductById(id);

  const allProducts = await getAllProducts(); // returns { docs: Product[] }

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  const relatedProducts = allProducts.docs
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4); // optional: limit to 4

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
