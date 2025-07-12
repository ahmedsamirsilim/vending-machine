import { ObjectId } from "mongodb";
import { z } from "zod";

export const zObjectId = z
	.custom<ObjectId>(
		(val) => {
			if (val instanceof ObjectId) return true;
			if (typeof val === "string") {
				return ObjectId.isValid(val);
			}
			return false;
		},
		{
			message: "Invalid ObjectId",
		},
	)
	.transform((val) => {
		return typeof val === "string" ? new ObjectId(val) : val;
	});

export const AvailableVMDepositeAmounts = [5, 10, 20, 50, 100];
