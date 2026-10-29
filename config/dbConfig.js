import mongoose from "mongoose";
import { DB_URL } from "./envConfig.js";

export default async function dbConnection() {
  try {
    await mongoose.connect(DB_URL);
    console.log("[INFO] Successfully Connected To Database");
  } catch (err) {
    console.log("[ERROR] Unable To Connect To Database");
  }
}
