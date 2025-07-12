import mongoose from "mongoose";
import { env } from "../shared/env";

const connectDB = async () => {
	try {
		await mongoose.connect(env.MONGODB_URI);
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
const disconnectDB = async () => {
	try {
		await mongoose.disconnect();
		console.log("MongoDB disconnected");
	} catch (error) {
		console.error("MongoDB disconnection error:", error);
	}
};

export const MongodbService = {
	connectDB,
	disconnectDB,
	mongoose,
};
