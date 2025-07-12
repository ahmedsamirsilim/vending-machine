import { ObjectId } from "mongodb";
import { ProductService } from "../services";
import { ProductUseCase } from "../usecases/product.usercase";

jest.mock("../services");

describe("ProductUseCase", () => {
	const mockProduct = {
		_id: new ObjectId(),
		name: "Test Product",
		cost: 100,
		quantity: 10,
		sellerId: new ObjectId(),
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("CreateProduct", () => {
		it("should call ProductService.createProduct and return a product", async () => {
			const productData = { name: "Test Product", cost: 100, quantity: 10, sellerId: new ObjectId() };
			(ProductService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

			const result = await ProductUseCase.CreateProduct(productData);

			expect(ProductService.createProduct).toHaveBeenCalledWith(productData);
			expect(result).toEqual(mockProduct);
		});
	});

	describe("UpdateProduct", () => {
		it("should call ProductService.updateProduct", async () => {
			const query = { _id: mockProduct._id };
			const updateData = { cost: 150 };
			await ProductUseCase.UpdateProduct(query, updateData);
			expect(ProductService.updateProduct).toHaveBeenCalledWith(query, updateData);
		});
	});

	describe("DeleteProduct", () => {
		it("should call ProductService.deleteProduct", async () => {
			const query = { _id: mockProduct._id };
			await ProductUseCase.DeleteProduct(query);
			expect(ProductService.deleteProduct).toHaveBeenCalledWith(query);
		});
	});

	describe("FindProduct", () => {
		it("should call ProductService.findProduct and return a product", async () => {
			const query = { _id: mockProduct._id };
			(ProductService.findProduct as jest.Mock).mockResolvedValue(mockProduct);

			const result = await ProductUseCase.FindProduct(query);

			expect(ProductService.findProduct).toHaveBeenCalledWith(query);
			expect(result).toEqual(mockProduct);
		});
	});

	describe("FindProducts", () => {
		it("should call ProductService.findProducts and return products", async () => {
			const query = { sellerId: mockProduct.sellerId };
			(ProductService.findProducts as jest.Mock).mockResolvedValue([mockProduct]);

			const result = await ProductUseCase.FindProducts(query);

			expect(ProductService.findProducts).toHaveBeenCalledWith(query);
			expect(result).toEqual([mockProduct]);
		});
	});
});
