import { Router } from "express";
import vmRouterV1 from "./v1/vm.route";

const vmRouter = Router();
vmRouter.use("/v1/vending-machines", vmRouterV1);

export default vmRouter;
