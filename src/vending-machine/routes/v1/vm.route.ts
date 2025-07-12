import { type Request, type Response, Router } from "express";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import { AvailableVMDepositeAmounts } from "../../../shared";
import { UserUseCase } from "../../../users/usecases";

const vmRouterV1 = Router();
vmRouterV1.use(authenticate);

vmRouterV1.post(
	"/deposite",
	validateRequest({
		body: z.object({
			amount: z
				.number()
				.refine((amount) => AvailableVMDepositeAmounts.includes(amount)),
		}),
	}),
	validateResponse(z.object({ amount: z.number() })),
	async (req: Request, res: Response) => {
		try {
			const { amount } = req.body;
			await UserUseCase.updateUser;
			res.status(200).json({ amount });
		} catch (error) {
			res.status(400).json({
				error: error instanceof Error ? error.message : "Failed to deposit",
			});
		}
	},
);

export default vmRouterV1;
