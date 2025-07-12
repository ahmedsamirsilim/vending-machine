import type { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";
import { ERROR_CODES, UnauthorizedError } from "../shared";
import { UserUseCase } from "../users/usecases";
import { JWT } from "../utils";

export const authenticate = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return UnauthorizedError(_res, ERROR_CODES.USER_UNAUTHORIZED);
		}

		const decodedToken = JWT.verifyToken(token);
		if (
			!decodedToken ||
			typeof decodedToken === "string" ||
			!decodedToken.userId
		) {
			return UnauthorizedError(_res, ERROR_CODES.USER_UNAUTHORIZED);
		}

		const user = await UserUseCase.GetUser({
			_id: new ObjectId(decodedToken.userId),
		});

		if (!user) {
			return UnauthorizedError(_res, ERROR_CODES.USER_UNAUTHORIZED);
		}

		if (!req.ctx) {
			req.ctx = { user: undefined };
		}
		req.ctx.user = user;

		next();
	} catch (error) {
		next(error);
	}
};
