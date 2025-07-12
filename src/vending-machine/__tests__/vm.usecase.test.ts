import { ObjectId } from "mongodb";
import type { ProductSchema } from "../../products/dtos";
import { ProductUseCase } from "../../products/usecases";
import type { UserSchema } from "../../users/dtos";
import { UserUseCase } from "../../users/usecases";
import { ERROR_CODES } from "../../shared";
import { VMUseCase } from "../usecases";

jest.mock("../../users/usecases");
jest.mock("../../products/usecases");

describe("VMUseCase", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("BuyProduct", () => {
		const mockUser: UserSchema = {
			_id: new ObjectId(),
			username: "buyer",
			deposit: 100,
			role: "buyer",
		};

		const mockProduct: ProductSchema = {
			_id: new ObjectId(),
			name: "Test Soda",
			cost: 50,
			quantity: 5,
			sellerId: new ObjectId(),
		};

		it("should successfully buy a product", async () => {
			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(mockProduct);
			(UserUseCase.UpdateUser as jest.Mock).mockResolvedValue({});
			(ProductUseCase.UpdateProduct as jest.Mock).mockResolvedValue({});

			const result = await VMUseCase.BuyProduct(
				mockUser,
				mockProduct._id ?? new ObjectId(),
				1,
			);

			expect(result.totalSpent).toBe(50);
			expect(result.productPurchased).toBe("Test Soda");
			expect(UserUseCase.UpdateUser).toHaveBeenCalledWith(
				{ _id: mockUser._id },
				{ deposit: 50 },
			);
			expect(ProductUseCase.UpdateProduct).toHaveBeenCalledWith(
				{ _id: mockProduct._id },
				{ quantity: 4 },
			);
		});

		it("should throw an error if product not found", async () => {
			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(null);

			await expect(
				VMUseCase.BuyProduct(mockUser, new ObjectId(), 1),
			).rejects.toThrow(ERROR_CODES.PRODUCT_NOT_FOUND);
		});

		it("should throw an error if product quantity is insufficient", async () => {
			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(mockProduct);

			await expect(
				VMUseCase.BuyProduct(mockUser, mockProduct._id ?? new ObjectId(), 10),
			).rejects.toThrow(ERROR_CODES.PRODUCT_INSUFFICIENT_QUANTITY);
		});

		it("should throw an error if user deposit is insufficient", async () => {
			const poorUser: UserSchema = { ...mockUser, deposit: 20 };
			(ProductUseCase.FindProduct as jest.Mock).mockResolvedValue(mockProduct);

			await expect(
				VMUseCase.BuyProduct(poorUser, mockProduct._id ?? new ObjectId(), 1),
			).rejects.toThrow(ERROR_CODES.USER_INSUFFICIENT_DEPOSIT);
		});
	});
});
