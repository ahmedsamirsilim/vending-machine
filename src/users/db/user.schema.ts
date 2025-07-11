import { type Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
	name: string;
	password: string;
	deposite?: number;
	role: "buyer" | "seller";
	createdAt: Date;
	updatedAt: Date;
}

export const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		deposite: { type: Number, default: 0 },
		role: { type: String, enum: ["buyer", "seller"], required: true },
	},
	{
		timestamps: true,
	},
);
