import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

// Placeholder for authentication middleware
export const authenticate = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	console.log("auth");

	next();
};
