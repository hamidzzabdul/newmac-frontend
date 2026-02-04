"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  CreateProductInput,
  updateProductSchema,
} from "@/types/product.schema";
import { useUpdateProduct } from "@/hooks/useMeatProducts";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
  product: Product;
}

function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editProduct = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      category: product.category,
      pricePerKg: product.pricePerKg,
      comparePrice: product.comparePrice || 0,
      stockkg: product.stockkg,
      visibility: product.visibility || "visible",
      featured: product.featured || false,
      onSale: product.onSale || false,
      allowBackorder: product.allowBackorder || false,
    },
  });
  // Initialize existing images
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setExistingImages(product.images);
    }
  }, [product.images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = existingImages.length + imageFiles.length;
    const remainingSlots = 3 - totalImages;

    if (remainingSlots <= 0) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const filesToAdd = newFiles.slice(0, remainingSlots);
    setImageFiles((prev) => [...prev, ...filesToAdd]);
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: CreateProductInput) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    formData.append("pricePerKg", String(data.pricePerKg));
    formData.append("comparePrice", String(data.comparePrice || 0));
    formData.append("stockkg", String(data.stockkg));
    formData.append("visibility", data.visibility || "visible");
    formData.append("featured", String(data.featured || false));
    formData.append("onSale", String(data.onSale || false));
    formData.append("allowBackorder", String(data.allowBackorder || false));

    imageFiles.forEach((file) => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.mutate(
      { id: product._id, formData },
      {
        onSuccess: () => {
          toast.success("Product updated!", { duration: 1500 });
          setTimeout(() => {
            const redirectToastId = toast.loading("Redirecting...", {
              duration: 2000,
            });

            // Step 3: After 8 seconds, redirect and dismiss the loading toast
            setTimeout(() => {
              toast.dismiss(redirectToastId);
              router.push("/dashboard/products");
            }, 4000);
          }, 2000); // wait for success toast to disappear
        },
        onError: (err: any) => {
          toast.error(err?.message || "Something went wrong");
          setIsSubmitting(false);
        },
      }
    );
  };

  const totalImages = existingImages.length + imageFiles.length;

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath: string) => {
    // If the path already includes 'uploads/', remove it to avoid duplication
    const cleanPath = imagePath.startsWith("uploads/")
      ? imagePath.substring(8)
      : imagePath;
    return `http://localhost:5000/uploads/${cleanPath}`;
  };
  const onError = (errors: any) => {
    console.log("FORM ERRORS:", errors);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Premium Beef Steak"
                  {...register("name")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Description
                </label>
                <textarea
                  rows={5}
                  {...register("description")}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text resize-none transition-all"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images{" "}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalImages}/3)
              </span>
            </h2>

            {totalImages < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer mb-4">
                <label htmlFor="productImageInput" className="cursor-pointer">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB (Max 3 images)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="productImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              </div>
            )}

            {(existingImages.length > 0 || imageFiles.length > 0) && (
              <div className="grid grid-cols-3 gap-4">
                {existingImages.map((img, i) => (
                  <div
                    key={`existing-${i}`}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`Product image ${i + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i, true)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {imageFiles.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-blue-300"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`New image ${i + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i, false)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Price (KSh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("pricePerKg", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.pricePerKg && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.pricePerKg.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Compare Price (KSh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("comparePrice", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Inventory
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Stock (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...register("stockkg", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.stockkg && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.stockkg.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Status
            </h2>
            <select
              {...register("visibility")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
            >
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Category
            </h2>
            <select
              {...register("category")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
            >
              <option value="" defaultChecked>
                Select category
              </option>
              <option value="beef">Beef</option>
              <option value="goat">Goat</option>
              <option value="lamb">Lamb</option>
              <option value="chicken">Chicken</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Featured Product
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register("onSale")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                On Sale
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register("allowBackorder")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Allow Backorder
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-6 mt-6">
        <Link
          href="/dashboard/products"
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}

export default EditProductForm;
