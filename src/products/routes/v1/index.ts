import { type Request, type Response, Router } from "express";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";

const productRouterV1 = Router();
productRouterV1.use(authenticate);

productRouterV1.post(
	"/",
	validateRequest(
		z.object({
			name: z.string(),
			price: z.number().positive(),
			quantity: z.number().int().positive(),
		}),
	),
	validateResponse(
		z.object({
			id: z.number(),
			name: z.string(),
			price: z.number().positive(),
			quantity: z.number().int().positive(),
		}),
	),
	(req: Request, res: Response) => {
		const { name, price, quantity } = req.body;
		const newProduct = {
			id: Date.now(),
			name,
			price,
			quantity,
		};
		res.status(201).json(newProduct);
	},
);

export default productRouterV1;
