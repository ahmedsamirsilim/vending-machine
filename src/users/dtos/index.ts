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

export const CreateUserSchema = z.object({
	body: z.object({
		username: z.string({ required_error: "Username is required" }),
		password: z
			.string({ required_error: "Password is required" })
			.min(6, "Password must be at least 6 characters long"),
		role: z.enum(["buyer", "seller"]).optional(),
	}),
});

export const UpdateUserSchema = z.object({
	params: z.object({
		id: zObjectId,
	}),
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

export const GetUserSchema = z.object({
	params: z.object({
		id: zObjectId,
	}),
});

export const DeleteUserSchema = z.object({
	params: z.object({
		id: zObjectId,
	}),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUserInput = z.infer<typeof GetUserSchema>;
export type DeleteUserInput = z.infer<typeof DeleteUserSchema>;
