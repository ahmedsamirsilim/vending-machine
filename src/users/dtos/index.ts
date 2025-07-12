import { z } from "zod";
import { zObjectId } from "../../shared";

export const User = z
	.object({
		_id: zObjectId.optional(),
		username: z.string().optional(),
		deposit: z.number().optional(),
		role: z.enum(["buyer", "seller"]).optional(),
		createdAt: z.date().optional(),
		updatedAt: z.date().optional(),
	})
	.partial();

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           default: johndoe
 *         password:
 *           type: string
 *           default: password123
 *         role:
 *           type: string
 *           enum: [buyer, seller]
 *           default: buyer
 */
export const CreateUserDto = z.object({
	username: z.string(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	role: z.enum(["buyer", "seller"]),
});

export const UpdateUserParams = z.object({
	id: zObjectId,
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         deposit:
 *           type: number
 *           default: 0
 */
export const UpdateUserDto = z.object({
	username: z.string().optional(),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.optional(),
	deposit: z.number().optional(),
	role: z.enum(["buyer", "seller"]).optional(),
});

export const GetUserDto = z.object({
	id: zObjectId,
});

export const DeleteUserDto = z.object({
	id: zObjectId,
});

export type UserSchema = z.infer<typeof User>;
export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;
export type GetUserInput = z.infer<typeof GetUserDto>;
export type DeleteUserInput = z.infer<typeof DeleteUserDto>;
