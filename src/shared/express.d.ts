import { UserSchema } from "../users/dtos";

declare global {
	namespace Express {
		interface Request {
			ctx: {
				user?: UserSchema;
			};
		}
	}
}
