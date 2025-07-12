import type {
	CreateProductInput,
	DeleteProductInput,
	ProductSchema,
	UpdateProductInput,
} from "../dtos";
import { ProductService } from "../services";

const CreateProduct = async (product: CreateProductInput) => {
	return ProductService.createProduct(product);
};

const UpdateProduct = async (
	query: ProductSchema,
	updateData: UpdateProductInput,
) => {
	return ProductService.updateProduct(query, updateData);
};

const DeleteProduct = async (query: ProductSchema) => {
	return ProductService.deleteProduct(query);
};

const FindProduct = async (query: ProductSchema) => {
	return ProductService.findProduct(query);
};

const FindProducts = async (query: ProductSchema) => {
	return ProductService.findProducts(query);
};

export const ProductUseCase = {
	CreateProduct,
	UpdateProduct,
	DeleteProduct,
	FindProduct,
	FindProducts,
};
