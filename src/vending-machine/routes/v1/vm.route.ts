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
