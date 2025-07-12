import jwt from "jsonwebtoken";
import { env } from "../shared";

export const generateToken = (userId: string): string => {
	return jwt.sign({ userId }, env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, env.JWT_SECRET);
};
