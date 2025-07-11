import { type Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
	name: string;
	cost: number;
	quantity: number;
	sellerId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const ProductSchema = new Schema({
	name: { type: String, required: true },
	cost: { type: Number, required: true },
	quantity: { type: Number, required: true },
	sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
	timestamps: true
});
