import { connect } from "mongoose";
import { logger } from "./helpers.js";

const connectDB = async () => {
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

export default connectDB;
