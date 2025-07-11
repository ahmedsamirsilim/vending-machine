import { type Request, type Response, Router } from "express";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import { NotFoundError } from "../../../shared";
import {
	CreateProductDto,
	ProductResponseDto,
	UpdateProductDto,
} from "../../dtos";
import { ProductUseCase } from "../../usecases";

const productRouterV1 = Router();
productRouterV1.use(authenticate);

productRouterV1.post(
	"/",
	validateRequest(CreateProductDto),
	validateResponse(ProductResponseDto),
	async (req: Request, res: Response) => {
		try {
			const { name, cost, quantity, sellerId } = req.body;
			const createProduct = await ProductUseCase.CreateProduct({
				name,
				cost,
				quantity,
				sellerId,
			});
			res.status(201).json(createProduct);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to create product",
			});
		}
	},
);

productRouterV1.get(
	"/",
	validateResponse(z.array(ProductResponseDto)),
	async (req: Request, res: Response) => {
		try {
			const products = await ProductUseCase.FindProducts();
			res.status(200).json(products);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to fetch products",
			});
		}
	},
);

productRouterV1.get(
	"/:id",
	validateResponse(ProductResponseDto),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const product = await ProductUseCase.FindProduct({ id });
			if (!product) {
				return NotFoundError(res);
			}
			res.status(200).json(product);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to fetch product",
			});
		}
	},
);

productRouterV1.put(
	"/:id",
	validateRequest(UpdateProductDto),
	validateResponse(z.object({ modifiedCount: z.number() })),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const updateData = req.body;
			const result = await ProductUseCase.UpdateProduct({ id }, updateData);
			if (result.modifiedCount === 0) {
				return res.status(404).json({ error: "Product not found" });
			}
			res.status(200).json(result);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to update product",
			});
		}
	},
);

productRouterV1.delete(
	"/:id",
	validateResponse(z.object({ deletedCount: z.number() })),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const result = await ProductUseCase.DeleteProduct({ id });
			if (result.deletedCount === 0) {
				return res.status(404).json({ error: "Product not found" });
			}
			res.status(200).json(result);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to delete product",
			});
		}
	},
);

export default productRouterV1;
