import { ObjectId } from "mongodb";
import { IProduct } from "../db/product.schema";
import { ProductUseCase } from "../usecases";

jest.mock("../db/product.model");

describe("ProductUseCase", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("CreateProduct", () => {
		it("should create a new product", async () => {
			const productData = {
				name: "Test Product",
				cost: 100,
				quantity: 10,
				sellerId: new ObjectId("67fcd0bd2401ff5addef1d02"),
			};

			(ProductUseCase.CreateProduct as jest.Mock).mockResolvedValue(
				productData,
			);

			const product = await ProductUseCase.CreateProduct(productData);

			expect(product).toBeDefined();
			expect(product.name).toBe(productData.name);
		});
	});
});
