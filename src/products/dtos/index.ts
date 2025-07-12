import { z } from "zod";
import { zObjectId } from "../../shared";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - name
 *         - cost
 *         - quantity
 *         - sellerId
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Coca-Cola"
 *         cost:
 *           type: number
 *           description: The cost of the product.
 *           example: 150
 *         quantity:
 *           type: number
 *           description: The available quantity of the product.
 *           example: 10
 *         sellerId:
 *           type: string
 *           description: The ID of the user selling the product.
 *           example: "60e9b4a0c3b4a8a0a4e8b0a5"
 */
export const CreateProductDto = z.object({
	name: z.string().min(1, "Name is required"),
	cost: z.number().positive("Cost must be positive"),
	quantity: z.number().int().positive("Quantity must be a positive integer"),
	sellerId: z.string().min(1, "Seller ID is required"),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProductDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Pepsi"
 *         cost:
 *           type: number
 *           description: The cost of the product.
 *           example: 125
 *         quantity:
 *           type: number
 *           description: The available quantity of the product.
 *           example: 5
 */
export const UpdateProductDto = z.object({
	name: z.string().min(1, "Name is required").optional(),
	cost: z.number().positive("Cost must be positive").optional(),
	quantity: z
		.number()
		.int()
		.positive("Quantity must be a positive integer")
		.optional(),
});

export const FindProductDto = z
	.object({
		_id: zObjectId,
		name: z.string().optional(),
		sellerId: zObjectId,
	})
	.partial();

export const DeleteProductDto = z.object({
	id: zObjectId,
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID.
 *           example: "60e9b4a0c3b4a8a0a4e8b0a6"
 *         name:
 *           type: string
 *           description: The name of the product.
 *           example: "Coca-Cola"
 *         cost:
 *           type: number
 *           description: The cost of the product.
 *           example: 150
 *         quantity:
 *           type: number
 *           description: The available quantity of the product.
 *           example: 10
 *         sellerId:
 *           type: string
 *           description: The ID of the user selling the product.
 *           example: "60e9b4a0c3b4a8a0a4e8b0a5"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the product was created.
 */
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
export type ProductSchema = z.infer<typeof FindProductDto>;
export type DeleteProductInput = z.infer<typeof DeleteProductDto>;
export type ProductResponse = z.infer<typeof ProductResponseDto>;
export type ProductListResponse = z.infer<typeof ProductListResponseDto>;
