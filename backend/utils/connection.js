import { connect } from "mongoose";
import { Vonage } from "@vonage/server-sdk";
import { logger } from "./helpers.js";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB Connected!");
  } catch (error) {
    logger.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export const vonageConnection = () => {
  try {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
    logger.info("Vonage Connected!");
    return vonage;
  } catch (error) {
    logger.error("Vonage Connection Failed:", error);
    process.exit(1);
  }
};
