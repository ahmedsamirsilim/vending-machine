import { ObjectId } from "mongodb";
import { z } from "zod";

export const zObjectId = z.custom<ObjectId>(
	(val) => {
		return val instanceof ObjectId;
	},
	{
		message: "Invalid ObjectId",
	},
);
