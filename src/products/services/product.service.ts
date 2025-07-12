import type { FilterQuery } from "mongoose";
import type { IProduct } from "../db/";
import { Models } from "../db/product.model";
import type {
	CreateProductInput,
	DeleteProductInput,
	ProductResponse,
	ProductSchema,
	UpdateProductInput,
} from "../dtos";

const createProduct = async (
	product: CreateProductInput,
): Promise<ProductResponse> => {
	try {
		const newProduct = await Models.Product.create(product);
		return newProduct;
	} catch (error) {
		throw new Error(
			`Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

const findProduct = async (query: ProductSchema) => {
	try {
		const product = await Models.Product.findOne(query);
		return product ? product.toObject() : null;
	} catch (error) {
		throw new Error(
			`Failed to find product: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

const findProducts = async (query: ProductSchema = {}) => {
	try {
		const products = await Models.Product.find(query);
		return products.map((product) => product.toObject());
	} catch (error) {
		throw new Error(
			`Failed to find products: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

const updateProduct = async (
	query: FilterQuery<IProduct>,
	updateData: UpdateProductInput,
) => {
	try {
		const result = await Models.Product.updateOne(query, updateData);
		return { modifiedCount: result.modifiedCount };
	} catch (error) {
		throw new Error(
			`Failed to update product: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

const deleteProduct = async (query: FilterQuery<IProduct>) => {
	try {
		const result = await Models.Product.deleteOne(query);
		return { deletedCount: result.deletedCount };
	} catch (error) {
		throw new Error(
			`Failed to delete product: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
};

export const ProductService = {
	createProduct,
	findProduct,
	findProducts,
	updateProduct,
	deleteProduct,
};
