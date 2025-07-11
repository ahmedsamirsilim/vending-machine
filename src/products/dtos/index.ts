import { z } from "zod";
import { zObjectId } from "../../shared";

export const CreateProductDto = z.object({
	name: z.string().min(1, "Name is required"),
	cost: z.number().positive("Cost must be positive"),
	quantity: z.number().int().positive("Quantity must be a positive integer"),
	sellerId: z.string().min(1, "Seller ID is required"),
});

export const UpdateProductDto = z.object({
	name: z.string().min(1, "Name is required").optional(),
	cost: z.number().positive("Cost must be positive").optional(),
	quantity: z
		.number()
		.int()
		.positive("Quantity must be a positive integer")
		.optional(),
});

export const FindProductDto = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	sellerId: z.string().optional(),
});

export const DeleteProductDto = z.object({
	id: z.string().min(1, "Product ID is required"),
});

export const ProductResponseDto = z.object({
	_id: zObjectId,
	name: z.string(),
	cost: z.number(),
	quantity: z.number(),
	sellerId: zObjectId,
	createdAt: z.date(),
});

export const ProductListResponseDto = z.array(ProductResponseDto);

export type CreateProductInput = z.infer<typeof CreateProductDto>;
export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
export type FindProductInput = z.infer<typeof FindProductDto>;
export type DeleteProductInput = z.infer<typeof DeleteProductDto>;
export type ProductResponse = z.infer<typeof ProductResponseDto>;
export type ProductListResponse = z.infer<typeof ProductListResponseDto>;
