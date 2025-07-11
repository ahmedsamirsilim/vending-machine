import express, { type Express } from "express";
import productsRouter from "./products/routes";
import usersRouter from "./users/routes";
import { env, MongodbService } from "./utils/";

const app: Express = express();
const port = env.PORT || 3000;

app.use(express.json());

app.use("/api", productsRouter);
app.use("/api", usersRouter);

app.listen(port, async () => {
	await MongodbService.connectDB();
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
