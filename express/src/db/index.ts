import mongoose from "mongoose";
import { DB_CONNECTION_URI } from "../config/db.config";

const initDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed to connect to DB with reason: ", err?.toString());
    throw err;
  }
};

export { initDB };
