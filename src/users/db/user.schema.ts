import { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	username: string;
	password: string;
	deposite?: number;
	role: "buyer" | "seller";
	createdAt: Date;
	updatedAt: Date;
}

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
