export type ProductCategory = "beef" | "chicken" | "goat" | "lamb" | "other";
export type ProductVisibility = "visible" | "hidden";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  pricePerKg: number;
  comparePrice?: number;
  images: string[];
  stockkg: number;
  sku: string;
  visibility?: ProductVisibility;
  featured?: boolean;
  onSale?: boolean;
  allowBackorder?: boolean;
}

// export interface Product {
//   _id: string;
//   slug: string;
//   name: string;
//   description?: string;
//   category: ProductCategory;
//   pricePerKg: number;
//   comparePrice?: number;
//   images: string[];
//   stockkg: number;
//   sku: string;
//   visibility?: ProductVisibility;
//   featured?: boolean;
//   onSale?: boolean;
//   allowBackorder?: boolean;
// }
