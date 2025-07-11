import bcrypt from "bcryptjs";
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

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

export const User = mongoose.model("User", UserSchema);
