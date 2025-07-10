import { Router } from "express";
import productRouterV1 from "./v1/product.route";

const productsRouter = Router();

productsRouter.use("/v1/products", productRouterV1);

export default productsRouter;
