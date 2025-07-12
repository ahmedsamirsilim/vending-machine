import type { ErrorRequestHandler } from "express";
import { ObjectId } from "mongodb";
import { ERROR_CODES } from "../shared/errorCodes";
import { BadRequestError, NotFoundError } from "../shared/errors";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const errorCodes = Object.values(ERROR_CODES);

	if (errorCodes.includes(err.message)) {
		return BadRequestError(res, err.message);
	}

	return res.status(500).json({ error: "Internal Server Error" });
};

export const validateResourceExists = async <T>(
	findFn: (query: any) => Promise<T | null>,
	query: any,
	notFoundErrorCode: string
) => {
	const resource = await findFn(query);
	if (!resource) {
		throw new Error(notFoundErrorCode);
	}
	return resource;
};
