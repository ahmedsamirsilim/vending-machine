import { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
	amount: number;
	name: string;
	cost: number;
	quantity: number;
	sellerId: Schema.Types.ObjectId;
}

export const ProductSchema = new Schema({
	amount: { type: Number, required: true },
	name: { type: String, required: true },
	cost: { type: Number, required: true },
	quantity: { type: Number, required: true },
	sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});
