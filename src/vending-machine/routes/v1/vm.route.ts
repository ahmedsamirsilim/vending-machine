import { type Request, type Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import { ProductUseCase } from "../../../products/usecases";
import {
	AvailableVMDepositeAmounts,
	BadRequestError,
	ERROR_CODES,
	NotFoundError,
	zObjectId,
} from "../../../shared";
import { UserUseCase } from "../../../users/usecases";
import { VMUseCase } from "../../usecases";

const vmRouterV1 = Router();
vmRouterV1.use(authenticate);

/**
 * @openapi
 * /vending-machine/deposite:
 *   post:
 *     tags:
 *       - Vending Machine
 *     summary: Deposit coins into the machine
 *     description: Only buyers can deposit coins. Accepted coin values are 5, 10, 20, 50, 100.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 enum: [5, 10, 20, 50, 100]
 *                 description: The coin value to deposit.
 *     responses:
 *       200:
 *         description: Deposit successful.
 *       400:
 *         description: Bad request (e.g., invalid amount, not a buyer).
 *       404:
 *         description: User not found.
 */
vmRouterV1.post(
	"/deposite",
	validateRequest({
		body: z.object({
			amount: z
				.number()
				.refine((amount) => AvailableVMDepositeAmounts.includes(amount), {
					message: `The amount should be one of the following: ${AvailableVMDepositeAmounts.join(
						", ",
					)}`,
				}),
		}),
	}),
	async (req: Request, res: Response) => {
		const { amount } = req.body;

		if (!req.ctx.user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}

		if (req.ctx.user?.role !== "buyer") {
			return BadRequestError(res, ERROR_CODES.USER_INSUFFICIENT_TYPE);
		}

		await UserUseCase.UpdateUser(
			{
				_id: new ObjectId(req.ctx.user._id),
			},
			{
				deposit: (req.ctx.user?.deposit ?? 0) + amount,
			},
		);
		res.status(200).json({
			message: `your deposit is ${amount} and you currently have ${req.ctx.user?.deposit + amount}`,
		});
	},
);

/**
 * @openapi
 * /vending-machine/reset:
 *   post:
 *     tags:
 *       - Vending Machine
 *     summary: Reset the user's deposit
 *     description: Allows a buyer to reset their deposit to 0 and retrieve their change. This is not implemented as a real-world change return mechanism, it just resets the deposit field.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deposit reset successfully.
 *       400:
 *         description: Bad request (e.g., not a buyer).
 *       404:
 *         description: User not found.
 */
vmRouterV1.post("/reset", async (req: Request, res: Response) => {
	if (!req.ctx.user) {
		return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
	}
	if (req.ctx.user?.role !== "buyer") {
		return BadRequestError(res, ERROR_CODES.USER_INSUFFICIENT_TYPE);
	}
	await UserUseCase.UpdateUser(
		{
			_id: new ObjectId(req.ctx.user._id),
		},
		{
			deposit: 0,
		},
	);
	res.status(200).json({
		message: "your deposit is reseted",
	});
});

/**
 * @openapi
 * /vending-machine/buy:
 *   post:
 *     tags:
 *       - Vending Machine
 *     summary: Buy a product
 *     description: Allows a buyer to purchase a product. The total cost is calculated, and if the user has enough deposit, the purchase is completed. The user's deposit is updated, and the product quantity is reduced.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyProductDto'
 *     responses:
 *       200:
 *         description: Purchase successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BuyProductResponse'
 *       400:
 *         description: Bad request (e.g., insufficient funds, product out of stock).
 *       404:
 *         description: User or product not found.
 */
vmRouterV1.post(
	"/buy",
	validateRequest({
		body: z.object({
			productId: zObjectId,
			quantity: z.number(),
		}),
	}),
	async (req: Request, res: Response) => {
		if (!req.ctx.user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}

		if (req.ctx.user?.role !== "buyer") {
			return BadRequestError(res, ERROR_CODES.USER_INSUFFICIENT_TYPE);
		}

		const result = await VMUseCase.BuyProduct(
			req.ctx.user,
			new ObjectId(req.body.productId),
			req.body.quantity,
		);
		res.status(200).json(result);
	},
);

export default vmRouterV1;
