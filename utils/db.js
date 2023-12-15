import { connect } from "mongoose";
import config from "../config.js";

async function connectDB() {
  try {
    const conn = await connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
}

export { connectDB };
