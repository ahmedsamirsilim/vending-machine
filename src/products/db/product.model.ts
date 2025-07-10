import mongoose from "mongoose";
import { ProductSchema } from "./product.schema";

export const Models = {
	Product: mongoose.model("Product", ProductSchema),
};
