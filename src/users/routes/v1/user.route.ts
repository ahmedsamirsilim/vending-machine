import { type Request, type Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
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
	"/login",
	validateRequest({
		body: z.object({ username: z.string(), password: z.string() }),
	}),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.getUser(req.body);
		res.status(200).json(user);
	},
);

userRouterV1.get(
	"/:id",
	authenticate,
	validateRequest({ params: GetUserDto }),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.getUser({
			_id: new ObjectId(req.params.id),
		});
		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}
		res.status(200).json(user);
	},
);

userRouterV1.put(
	"/:id",
	authenticate,
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
	authenticate,
	validateRequest({ params: DeleteUserDto }),
	async (req: Request, res: Response) => {
		await UserUseCase.deleteUser(req.params.id);
		res.status(204).send();
	},
);

export default userRouterV1;
