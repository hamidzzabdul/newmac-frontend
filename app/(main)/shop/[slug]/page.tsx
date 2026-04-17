import { getAllProducts, getProductBySlug } from "@/lib/api/products";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  const allProducts = await getAllProducts();

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  const relatedProducts = allProducts.docs
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
