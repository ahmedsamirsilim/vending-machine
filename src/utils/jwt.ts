import jwt from "jsonwebtoken";
import { env } from "../shared";

const generateToken = (userId: string): string => {
	return jwt.sign({ userId }, env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

const verifyToken = (token: string) => {
	return jwt.verify(token, env.JWT_SECRET);
};

export const JWT = {
	generateToken,
	verifyToken,
};
