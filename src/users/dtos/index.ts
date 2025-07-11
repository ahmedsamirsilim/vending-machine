import { z } from "zod";
import { zObjectId } from "../../shared";

export const UserSchema = z.object({
	id: zObjectId,
	username: z.string(),
	deposit: z.number(),
	role: z.enum(["buyer", "seller"]),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateUserDto = z.object({
	username: z.string(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	role: z.enum(["buyer", "seller"]),
});

export const UpdateUserDto = z.object({
	id: zObjectId,
	body: z
		.object({
			username: z.string().optional(),
			password: z
				.string()
				.min(6, "Password must be at least 6 characters long")
				.optional(),
			deposit: z.number().optional(),
			role: z.enum(["buyer", "seller"]).optional(),
		})
		.partial(),
});

export const GetUserDto = z.object({
	id: zObjectId,
});

export const DeleteUserDto = z.object({
	id: zObjectId,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type UpdateUserInput = z.infer<typeof UpdateUserDto>;
export type GetUserInput = z.infer<typeof GetUserDto>;
export type DeleteUserInput = z.infer<typeof DeleteUserDto>;
