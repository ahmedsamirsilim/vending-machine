import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		deposit: {
			type: Number,
			default: 0,
		},
		role: {
			type: String,
			enum: ["buyer", "seller"],
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const User = mongoose.model("User", UserSchema);
