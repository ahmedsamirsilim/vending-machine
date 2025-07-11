import { type Request, type Response, Router } from "express";
import { validateRequest, validateResponse } from "../../../middleware";
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
	validateRequest(CreateUserDto),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.createUser(req.body);
		res.status(201).json(user);
	},
);

userRouterV1.get("/", async (_: Request, res: Response) => {
	const users = await UserUseCase.getAllUsers();
	res.status(200).json(users);
});

userRouterV1.get(
	"/:id",
	validateRequest(GetUserDto),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.getUserById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	},
);

userRouterV1.put(
	"/:id",
	validateRequest(UpdateUserDto),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.updateUser(req.params.id, req.body);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	},
);

userRouterV1.delete(
	"/:id",
	validateRequest(DeleteUserDto),
	async (req: Request, res: Response) => {
		await UserUseCase.deleteUser(req.params.id);
		res.status(204).send();
	},
);

export default userRouterV1;
