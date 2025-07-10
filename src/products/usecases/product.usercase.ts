import { ProductService } from "../services";

const CreateProduct = async (
	product: Parameters<typeof ProductService.createProduct>[0],
) => {
	return ProductService.createProduct(product);
};

const UpdateProduct = async (
	product: Parameters<typeof ProductService.updateProduct>[0],
	query: Parameters<typeof ProductService.updateProduct>[1],
) => {
	return ProductService.updateProduct(product, query);
};

const DeleteProduct = async (
	product: Parameters<typeof ProductService.deleteProduct>[0],
) => {
	return ProductService.deleteProduct(product);
};

const FindProduct = async (
	query: Parameters<typeof ProductService.findProduct>[0],
) => {
	return ProductService.findProduct(query);
};

export const ProductUseCase = {
	CreateProduct,
	UpdateProduct,
	DeleteProduct,
	FindProduct,
};
