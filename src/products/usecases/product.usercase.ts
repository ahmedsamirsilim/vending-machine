import type {
	CreateProductInput,
	DeleteProductInput,
	FindProductInput,
	ProductResponse,
	UpdateProductInput,
} from "../dtos";
import { ProductService } from "../services";

const CreateProduct = async (
	product: CreateProductInput,
): Promise<ProductResponse> => {
	return ProductService.createProduct(product);
};

const UpdateProduct = async (
	query: FindProductInput,
	updateData: UpdateProductInput,
): Promise<{ modifiedCount: number }> => {
	return ProductService.updateProduct(query, updateData);
};

const DeleteProduct = async (
	query: DeleteProductInput,
): Promise<{ deletedCount: number }> => {
	return ProductService.deleteProduct(query);
};

const FindProduct = async (
	query: FindProductInput,
): Promise<ProductResponse | null> => {
	return ProductService.findProduct(query);
};

const FindProducts = async (
	query: FindProductInput = {},
): Promise<ProductResponse[]> => {
	return ProductService.findProducts(query);
};

export const ProductUseCase = {
	CreateProduct,
	UpdateProduct,
	DeleteProduct,
	FindProduct,
	FindProducts,
};
