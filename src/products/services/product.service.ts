import type { FilterQuery, UpdateQuery } from "mongoose";
import { Models } from "../db/product.model";
import type { IProduct } from "../db/product.schema";

const createProduct = async (
	product: Parameters<typeof Models.Product.create>[0],
) => {
	return Models.Product.create(product);
};

const findProduct = async (query: FilterQuery<IProduct>) => {
	return Models.Product.findOne(query);
};

const updateProduct = async (
	query: FilterQuery<IProduct>,
	product: UpdateQuery<IProduct>,
) => {
	return Models.Product.updateOne(query, product);
};

const deleteProduct = async (query: FilterQuery<IProduct>) => {
	return Models.Product.deleteOne(query);
};

export const ProductService = {
	createProduct,
	updateProduct,
	deleteProduct,
	findProduct,
};
