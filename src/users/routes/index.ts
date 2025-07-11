import { Router } from "express";
import userRouterV1 from "./v1/user.route";

const userRouter = Router();

userRouter.use("/v1/users", userRouterV1);

export default userRouter;
