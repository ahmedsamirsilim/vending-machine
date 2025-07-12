import { type Request, type Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import {
	BadRequestError,
	ERROR_CODES,
	NotFoundError,
	zObjectId,
} from "../../../shared";
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
		const { name, cost, quantity } = req.body;

		if (req.ctx.user?.role !== "seller") {
			return NotFoundError(res, ERROR_CODES.USER_INSUFFICIENT_TYPE);
		}

		const createProduct = await ProductUseCase.CreateProduct({
			name,
			cost,
			quantity,
			sellerId: req.ctx.user?._id ?? new ObjectId(),
		});
		res.status(201).json(createProduct);
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
		const products = await ProductUseCase.FindProducts({});
		res.status(200).json(products);
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
		const { id } = req.params;
		const product = await ProductUseCase.FindProduct({
			_id: new ObjectId(id),
		});
		if (!product) {
			return NotFoundError(res, ERROR_CODES.PRODUCT_NOT_FOUND);
		}
		res.status(200).json(product);
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
	"/:productId",
	validateRequest({
		params: z.object({ productId: zObjectId }),
		body: z
			.object({
				name: z.string().optional(),
				cost: z.number().optional(),
				quantity: z.number().optional(),
			})
			.refine((data) => Object.keys(data).length > 0, {
				message: "At least one of name, cost, or quantity must be provided",
			}),
	}),
	async (req: Request, res: Response) => {
		const { productId } = req.params;

		/*
		  -- we could use workflow here to support isolation and serlizable execution
		  -- or we could use findAndUpdate if we don't care about who own the product 
		  -- or cache product data in memory and validate the update direct,
		  etc...
		*/

		//TODO: use workflow temporal

		const product = await ProductUseCase.FindProduct({
			_id: new ObjectId(productId),
		});

		if (!product) {
			return NotFoundError(res, ERROR_CODES.PRODUCT_NOT_FOUND);
		}

		console.log(req.ctx.user);
		console.log(product.sellerId);

		if (
			!req.ctx.user ||
			product.sellerId.toString() !== req.ctx.user?._id?.toString()
		) {
			return BadRequestError(res, ERROR_CODES.PRODUCT_INSUFFICIENT_OWNER);
		}

		const updateData = req.body;
		const result = await ProductUseCase.UpdateProduct(
			{ _id: new ObjectId(productId) },
			updateData,
		);

		res.status(200).json(result);
	},
);

productRouterV1.delete(
	"/:productId",
	validateResponse(z.object({ deletedCount: z.number() })),
	async (req: Request, res: Response) => {
		const { productId } = req.params;
		const result = await ProductUseCase.DeleteProduct({
			_id: new ObjectId(productId),
		});
		if (result.deletedCount === 0) {
			return NotFoundError(res, ERROR_CODES.PRODUCT_NOT_FOUND);
		}
		res.status(200).json(result);
	},
);

export default productRouterV1;
