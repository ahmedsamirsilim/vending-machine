import type { Response } from "express";

export const NotFoundError = (res: Response, errorCode: string) => {
	return res.status(404).json({ error: errorCode });
};

export const BadRequestError = (res: Response, errorCode: string) => {
	return res.status(400).json({ error: errorCode });
};

export const UnauthorizedError = (res: Response, errorCode: string) => {
	return res.status(401).json({ error: errorCode });
};

export const ForbiddenError = (res: Response, errorCode: string) => {
	return res.status(403).json({ error: errorCode });
};

export const InternalServerError = (res: Response) => {
	return res.status(500).json({ error: "Internal Server Error" });
};
