import mongoose from "mongoose";
import { UserSchema } from "./user.schema";

export const Models = {
	User: mongoose.model("User", UserSchema),
};
