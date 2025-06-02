
// src/lib/schemas/product-schema.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().min(1, 'Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to 2 decimal places'),
  description: z.string().optional(),
  stock: z.number().min(0, 'Stock must be a non-negative number'),
  categoryId: z.string().optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type Product = z.infer<typeof ProductSchema> & {
  id: string;
};
