"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle case when images array is empty
  const displayImages =
    images.length > 0 ? images : ["/placeholder-product.jpg"];
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Navigation - Left Side on Desktop, Bottom on Mobile */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-150 pb-2 md:pb-0">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                selectedImage === index
                  ? "border-black ring-black ring-offset-2"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                unoptimized
                className="object-cover "
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative">
        <div className="sticky top-4">
          <div className="relative w-full aspect-square bg-neutral-50 overflow-hidden rounded-2xl border border-gray-200">
            <div
              className={`relative w-full h-full ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={displayImages[selectedImage]}
                alt={`Product image ${selectedImage + 1}`}
                fill
                unoptimized
                className={`object-contain transition-transform duration-500 ease-out ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Image Counter Badge */}
            {displayImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                {selectedImage + 1} / {displayImages.length}
              </div>
            )}

            {/* Zoom Hint */}
            {!isZoomed && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border border-gray-200 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
                Click to zoom
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? displayImages.length - 1 : prev - 1
                  )
                }
                className="bg-white hover:bg-gray-50 border border-gray-300 p-3 rounded-full shadow-sm transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === displayImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="bg-white hover:bg-gray-50 border border-gray-300 p-3 rounded-full shadow-sm transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5 text-gray-700 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
