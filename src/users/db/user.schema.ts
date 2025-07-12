import { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	username: string;
	password: string;
	deposite?: number;
	role: "buyer" | "seller";
	createdAt: Date;
	updatedAt: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID.
 *           example: 60e9b4a0c3b4a8a0a4e8b0a5
 *         username:
 *           type: string
 *           description: The user's username.
 *           example: johndoe
 *         deposit:
 *           type: number
 *           description: The user's current deposit.
 *           example: 100
 *         role:
 *           type: string
 *           description: The user's role.
 *           enum: [buyer, seller]
 *           example: buyer
 */
export const UserSchema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		deposite: { type: Number, default: 0 },
		role: { type: String, enum: ["buyer", "seller"], required: true },
	},
	{
		timestamps: true,
	},
);
