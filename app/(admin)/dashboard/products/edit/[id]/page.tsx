"use client";

import EditProductForm from "@/app/(admin)/components/forms/EditProductForm";
import { useGetProductById } from "@/hooks/useMeatProducts";
import Link from "next/link";
import { useParams } from "next/navigation";

function EditProductPage() {
  const params = useParams();
  const ProductId = params?.id as string;
  const { data: product, isLoading, isError } = useGetProductById(ProductId);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load product</p>
          <Link
            href="/dashboard/products"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link
              href="/dashboard/products"
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900">Edit Product</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product information and inventory
          </p>
        </div>
      </div>
      <EditProductForm product={product} />
    </div>
  );
}

export default EditProductPage;
