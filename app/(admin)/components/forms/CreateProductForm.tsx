"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  CreateProductInput,
} from "@/types/product.schema";
import { useCreateProduct } from "@/hooks/useMeatProducts";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

function CreateProductForm() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProduct = useCreateProduct();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  });

  useEffect(() => {
    setValue("images", [], { shouldValidate: false });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const remainingSlots = 3 - imageFiles.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    const updatedPreviews = [...imagePreviews, ...newPreviews];
    const updatedFiles = [...imageFiles, ...filesToAdd];

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    setValue("images", updatedPreviews, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);

    setValue("images", updatedPreviews, { shouldValidate: true });
  };
  const onSubmit = async (data: CreateProductInput) => {
    const formData = new FormData();

    setIsSubmitting(true);

    // Append normal fields
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    formData.append("pricePerKg", String(data.pricePerKg));
    formData.append("comparePrice", String(data.comparePrice || ""));
    formData.append("stockkg", String(data.stockkg));
    formData.append("visibility", data.visibility || "visible");
    formData.append("featured", String(data.featured || false));
    formData.append("onSale", String(data.onSale || false));
    formData.append("allowBackorder", String(data.allowBackorder || false));

    // Append ACTUAL FILES
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    createProduct.mutate(formData, {
      onSuccess: async () => {
        // Delay response by 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Show toast
        toast.success("Product has been created!");

        // Reset form
        reset();
        setImageFiles([]);
        setImagePreviews([]);
        setIsSubmitting(false);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Something went wrong");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Premium Beef Steak"
                  {...register("name")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  {...register("description")}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text resize-none transition-all"
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Images
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({imageFiles.length}/3)
              </span>
            </h2>

            {imageFiles.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer mb-4">
                <label htmlFor="productImageInput" className="cursor-pointer">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
                    name="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                </label>
              </div>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.images && (
              <p className="text-xs text-red-500 mt-2">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pricing
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KSh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("pricePerKg", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.pricePerKg && (
                  <p className="text-xs text-red-500">
                    {errors.pricePerKg.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare Price (KSh)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  {...register("comparePrice", {
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.comparePrice && (
                  <p className="text-xs text-red-500">
                    {errors.comparePrice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Inventory
            </h2>

            <div className="grid  gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  {...register("stockkg", { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text transition-all"
                />
                {errors.stockkg && (
                  <p className="text-xs text-red-500">
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  {...register("visibility")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
                {errors.visibility && (
                  <p className="text-xs text-red-500">
                    {errors.visibility.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Organization
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category")}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                >
                  <option value="beef" defaultChecked>
                    Beef
                  </option>
                  <option value="goat">Goat</option>
                  <option value="lamb">Lamb</option>
                  <option value="chicken">Chicken</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Options
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Featured Product
                  </span>
                  <p className="text-xs text-gray-500">Show on homepage</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("onSale")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    On Sale
                  </span>
                  <p className="text-xs text-gray-500">
                    Products you Have on Sale
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("allowBackorder")}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Allow Backorder
                  </span>
                  <p className="text-xs text-gray-500">
                    Sell when out of stock
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Link
          href="/dashboard/products"
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting} // ✅ Disable button
          className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer shadow-sm hover:shadow-md ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Product"}{" "}
          {/* optional loading text */}
        </button>
      </div>
    </form>
  );
}

export default CreateProductForm;
