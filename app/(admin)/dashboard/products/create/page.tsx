"use client";

import CreateProductForm from "@/app/(admin)/components/forms/CreateProductForm";
import Link from "next/link";

function CreateProductPage() {
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
            <span className="text-gray-900">Create Product</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Product
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new product to your inventory
          </p>
        </div>
      </div>
      <CreateProductForm />
    </div>
  );
}

export default CreateProductPage;
