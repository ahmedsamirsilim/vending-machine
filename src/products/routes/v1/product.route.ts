import { type Request, type Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import { ERROR_CODES, NotFoundError } from "../../../shared";
import {
	CreateProductDto,
	ProductResponseDto,
	UpdateProductDto,
} from "../../dtos";
import { ProductUseCase } from "../../usecases";

const productRouterV1 = Router();
productRouterV1.use(authenticate);

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
productRouterV1.post(
	"/",
	validateRequest({ body: CreateProductDto }),
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

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve a list of all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
productRouterV1.get(
	"/",
	validateResponse(z.array(ProductResponseDto)),
	async (req: Request, res: Response) => {
		try {
			const products = await ProductUseCase.FindProducts({});
			res.status(200).json(products);
		} catch (error) {
			res.status(400).json({
				error:
					error instanceof Error ? error.message : "Failed to fetch products",
			});
		}
	},
);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a single product by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
productRouterV1.get(
	"/:id",
	validateResponse(ProductResponseDto),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const product = await ProductUseCase.FindProduct({
				_id: new ObjectId(id),
			});
			if (!product) {
				return NotFoundError(res, ERROR_CODES.PRODUCT_NOT_FOUND);
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

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
productRouterV1.put(
	"/:id",
	validateRequest({
		params: z.object({ id: z.string().min(1, "Product ID is required") }),
		body: UpdateProductDto,
	}),
	validateResponse(z.object({ modifiedCount: z.number() })),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const updateData = req.body;
			const result = await ProductUseCase.UpdateProduct(
				{ _id: new ObjectId(id) },
				updateData,
			);
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
			const result = await ProductUseCase.DeleteProduct({
				_id: new ObjectId(id),
			});
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
