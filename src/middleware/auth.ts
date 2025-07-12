import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ERROR_CODES, UnauthorizedError } from "../shared";
import { JWT } from "../utils";

// Placeholder for authentication middleware
export const authenticate = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return UnauthorizedError(_res, ERROR_CODES.USER_UNAUTHORIZED);
	}

	const decodedToken = JWT.verifyToken(token);
	if (!decodedToken) {
		return UnauthorizedError(_res, ERROR_CODES.USER_UNAUTHORIZED);
	}

	next();
};
