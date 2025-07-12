import type { NextFunction, Request, Response } from "express";
import { type ZodError, type ZodType, z } from "zod";

type ZodErrorDetail = {
	path: (string | number)[];
	message: string;
	code: string;
	expected?: string;
	received?: string;
	validation?: string;
};

type TypedZodError = Omit<ZodError, "errors"> & {
	errors: ZodErrorDetail[];
};

export const validateRequest = (schemas: {
	params?: z.ZodSchema<any>;
	body?: z.ZodSchema<any>;
	query?: z.ZodSchema<any>;
}) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (schemas.params) {
				req.params = await schemas.params.parseAsync(req.params);
			}
			if (schemas.body) {
				req.body = await schemas.body.parseAsync(req.body);
			}
			if (schemas.query) {
				req.query = await schemas.query.parseAsync(req.query);
			}
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorTyped = error as unknown as TypedZodError;
				const formattedErrors = errorTyped.errors.map((err) => ({
					field: err.path.join("."),
					message: err.message,
					expectedType: err.code === "invalid_type" ? err.expected : undefined,
				}));
				return res.status(400).json({
					error: "Validation Error",
					message: "Invalid request data",
					details: formattedErrors,
				});
			}
			console.error("Validation error:", error);
			return res.status(500).json({
				error: "Internal Server Error",
				message: "An unexpected error occurred during validation",
			});
		}
	};
};

export const validateResponse =
	<T extends z.ZodSchema>(schema: T) =>
	(req: Request, res: Response, next: NextFunction) => {
		const originalJson = res.json;

		// Override res.json to enforce the schema type
		res.json = (body: z.infer<T>) => {
			try {
				schema.parse(body);
				return originalJson.call(res, body);
			} catch (e) {
				if (e instanceof z.ZodError) {
					const error = e as unknown as TypedZodError;
					const formattedErrors = error.errors.map((err) => ({
						field: err.path.join("."),
						message: err.message,
						expectedType:
							err.code === "invalid_type" ? err.expected : undefined,
						received: err.received,
					}));

					console.error("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					console.error("!!!         RESPONSE VALIDATION FAILED        !!!");
					console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					console.error(`Route: ${req.method} ${req.originalUrl}`);
					console.error(
						"The API handler returned an object that does not match the expected response schema.",
					);
					console.error("Details:", JSON.stringify(formattedErrors, null, 2));
					console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");

					res.status(500);
					return originalJson.call(res, {
						error: "Server Validation Error",
						message:
							"The server returned an invalid response. Check server logs for details.",
						details: formattedErrors,
					});
				}
				throw e;
			}
		};

		next();
	};
