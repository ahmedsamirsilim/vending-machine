import { type Request, type Response, Router } from "express";
import { z } from "zod";
import { validateRequest, validateResponse } from "../../../middleware";
import { ERROR_CODES, NotFoundError } from "../../../shared";
import { zObjectId } from "../../../shared/types";
import {
	CreateUserDto,
	DeleteUserDto,
	GetUserDto,
	UpdateUserDto,
} from "../../dtos";
import { UserUseCase } from "../../usecases";

const userRouterV1 = Router();

userRouterV1.post(
	"/",
	validateRequest({ body: CreateUserDto }),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.createUser(req.body);
		res.status(201).json(user);
	},
);

userRouterV1.get(
	"/:id",
	validateRequest({ params: GetUserDto }),
	async (req: Request, res: Response) => {
		console.log(req.params);
		const user = await UserUseCase.getUserById(req.params.id);
		console.log(user);
		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}
		res.status(200).json(user);
	},
);

userRouterV1.put(
	"/:id",
	validateRequest({
		params: z.object({ id: zObjectId }),
		body: UpdateUserDto,
	}),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.updateUser(req.params.id, req.body);
		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}
		res.status(200).json(user);
	},
);

userRouterV1.delete(
	"/:id",
	validateRequest({ params: DeleteUserDto }),
	async (req: Request, res: Response) => {
		await UserUseCase.deleteUser(req.params.id);
		res.status(204).send();
	},
);

export default userRouterV1;
