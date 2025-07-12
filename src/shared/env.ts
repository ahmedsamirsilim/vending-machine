import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	MONGODB_URI: z.string().default("mongodb://localhost:27017"),
	JWT_SECRET: z.string().default("secret"),
});

export const env = envSchema.parse(process.env);
