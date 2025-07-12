import express, { type Express } from "express";
import { MongodbService } from "./lib";
import productsRouter from "./products/routes";
import { env } from "./shared";
import usersRouter from "./users/routes";
import vmRouter from "./vending-machine/routes";
import { httpLogger } from "./middleware/logger";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';

const app: Express = express();
const port = env.PORT || 3000;

app.use(httpLogger);
app.use(express.json());

app.use("/api", productsRouter);
app.use("/api", usersRouter);
app.use("/api", vmRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, async () => {
	await MongodbService.connectDB();
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
