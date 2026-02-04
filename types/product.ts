// types/product.ts
export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  pricePerKg: number;
  comparePrice?: number;
  sku: string;
  stockkg: number;
  visibility?: string;
  featured?: boolean;
  onSale?: boolean;
  allowBackorder?: boolean;
  images?: string[];
  isAvailable?: boolean;
}
  