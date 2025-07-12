import type { ObjectId } from "mongodb";
import { ProductUseCase } from "../../products/usecases";
import { ERROR_CODES } from "../../shared";
import type { UserSchema } from "../../users/dtos";
import { UserUseCase } from "../../users/usecases";

export const BuyProduct = async (
	user: UserSchema,
	productId: ObjectId,
	quantity: number,
) => {
	const product = await ProductUseCase.FindProduct({
		_id: productId,
	});

	if (!product) {
		throw new Error(ERROR_CODES.PRODUCT_NOT_FOUND);
	}

	if (product.quantity < quantity) {
		throw new Error(ERROR_CODES.PRODUCT_INSUFFICIENT_QUANTITY);
	}

	if (product.cost * quantity > (user.deposit ?? 0)) {
		throw new Error(ERROR_CODES.USER_INSUFFICIENT_DEPOSIT);
	}

	await Promise.all([
		UserUseCase.UpdateUser(
			{ _id: user._id },
			{ deposit: (user.deposit ?? 0) - product.cost * quantity },
		),
		ProductUseCase.UpdateProduct(
			{ _id: productId },
			{ quantity: product.quantity - quantity },
		),
	]);

	return {
		totalSpent: product.cost * quantity,
		productPurchased: product.name,
		quantity,
		change: (user.deposit ?? 0) - product.cost * quantity,
	};
};

export const VMUseCase = {
	BuyProduct,
};
