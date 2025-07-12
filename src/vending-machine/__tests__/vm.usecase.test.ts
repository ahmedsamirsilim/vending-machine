import { ObjectId } from "mongodb";
import type { ProductSchema } from "../../products/dtos";
import { ProductUseCase } from "../../products/usecases";
import type { UserSchema } from "../../users/dtos";
import { UserUseCase } from "../../users/usecases";
import { VMUseCase } from "../usecases";

jest.mock("../../users/usecases");
jest.mock("../../products/usecases");

describe("VMUseCase", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("BuyProduct", () => {
		it("should successfully buy a product", async () => {
			const user: UserSchema = {
				_id: new ObjectId(),
				username: "buyer",
				deposit: 100,
				role: "buyer",
			};
			const product: ProductSchema = {
				_id: new ObjectId(),
				productName: "Test Soda",
				cost: 50,
				quantity: 5,
				sellerId: new ObjectId(),
			};

			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(product);
			(UserUseCase.UpdateUser as jest.Mock).mockResolvedValue({});
			(ProductUseCase.UpdateProduct as jest.Mock).mockResolvedValue({});

			const result = await VMUseCase.BuyProduct(user, product._id, 1);

			expect(result.totalSpent).toBe(50);
			expect(result.productPurchased).toBe("Test Soda");
			expect(UserUseCase.UpdateUser).toHaveBeenCalledWith(
				{ _id: user._id },
				{ deposit: 50 },
			);
			expect(ProductUseCase.UpdateProduct).toHaveBeenCalledWith(
				{ _id: product._id },
				{ quantity: 4 },
			);
		});

		it("should throw an error if product not found", async () => {
			const user: UserSchema = {
				_id: new ObjectId(),
				username: "buyer",
				deposit: 100,
				role: "buyer",
			};
			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(null);

			await expect(
				VMUseCase.BuyProduct(user, new ObjectId(), 1),
			).rejects.toThrow("Product not found");
		});
	});
});
