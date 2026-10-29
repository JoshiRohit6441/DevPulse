import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRET,
} from "./envConfig.js";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_SECRET,
});

export async function cloudinaryStatus() {
  try {
    await cloudinary.api.ping();
    console.log("[INFO] Successfully Connected To Cloudinary Cloud");
  } catch (err) {
    console.log("[ERROR] Unable To Connect To Cloudinary Cloud");
  }
}

export default cloudinary;
