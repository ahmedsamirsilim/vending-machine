import express, { type Express } from "express";
import { MongodbService } from "./lib";
import productsRouter from "./products/routes";
import { env } from "./shared";
import usersRouter from "./users/routes";
import vmRouter from "./vending-machine/routes";

const app: Express = express();
const port = env.PORT || 3000;

app.use(express.json());

app.use("/api", productsRouter);
app.use("/api", usersRouter);
app.use("/api", vmRouter);

app.listen(port, async () => {
	await MongodbService.connectDB();
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
