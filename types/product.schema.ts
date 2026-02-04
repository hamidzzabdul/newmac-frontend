// types/product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.enum(["beef", "chicken", "goat", "lamb", "other"]).refine((val) => !!val, {
    message: "Category is required",
  }),
  pricePerKg: z.number().min(0, "Price must be at least 0"),
  comparePrice: z.number().min(0).optional(),
  images: z
  .array(z.string().min(1, "Image URL cannot be empty"))
  .min(1, "At least one product image is required"), 
  stockkg: z.number().min(0, "Stock must be at least 0"),
  visibility: z.enum(["visible", "hidden"]).optional(),
  featured: z.boolean().optional(),
  onSale: z.boolean().optional(),
  allowBackorder: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;


export const updateProductSchema = createProductSchema
  .omit({ images: true })
  .extend({
    images: z.any().optional(),
  });
