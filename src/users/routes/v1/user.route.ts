import { type Request, type Response, Router } from "express";
import { ObjectId } from "mongodb";
import { z } from "zod";
import {
	authenticate,
	validateRequest,
	validateResponse,
} from "../../../middleware";
import { ERROR_CODES, NotFoundError, zObjectId } from "../../../shared";
import { BcryptService, JWT } from "../../../utils";
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
		const { body } = req;
		body.password = await BcryptService.hashPassword(body.password);
		const user = await UserUseCase.CreateUser(body);
		res.status(201).json(user);
	},
);

userRouterV1.get(
	"/login",
	validateRequest({
		body: z.object({ username: z.string(), password: z.string() }),
	}),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.GetUser({ username: req.body.username });

		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}

		const passwordValidation = await BcryptService.comparePassword(
			req.body.password,
			user.password,
		);
		if (!passwordValidation) {
			return NotFoundError(res, ERROR_CODES.USER_INVALID_CREDENTIALS);
		}
		res.status(200).json({ token: JWT.generateToken(user._id.toString()) });
	},
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a single user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
userRouterV1.get(
	"/:id",
	authenticate,
	validateRequest({ params: GetUserDto }),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.GetUser({
			_id: new ObjectId(req.params.id),
		});
		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}
		res.status(200).json(user);
	},
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
userRouterV1.put(
	"/:id",
	authenticate,
	validateRequest({
		params: z.object({ id: zObjectId }),
		body: UpdateUserDto,
	}),
	async (req: Request, res: Response) => {
		const user = await UserUseCase.UpdateUser(
			{ _id: new ObjectId(req.params.id) },
			req.body,
		);
		if (!user) {
			return NotFoundError(res, ERROR_CODES.USER_NOT_FOUND);
		}
		res.status(200).json(user);
	},
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
userRouterV1.delete(
	"/:id",
	authenticate,
	validateRequest({ params: DeleteUserDto }),
	async (req: Request, res: Response) => {
		await UserUseCase.DeleteUser({ _id: new ObjectId(req.params.id) });
		res.status(204).send();
	},
);

export default userRouterV1;
