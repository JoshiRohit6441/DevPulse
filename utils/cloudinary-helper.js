import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs/promises";

async function uploadToCloudinary(filePath) {
  if (!filePath) return null;

  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;
  } catch (err) {
    console.error("[ERROR] Unable to upload file to Cloudinary:", err.message);
    throw err;
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("Unable to delete temporary file:", err.message);
      }
    }
  }
}

export async function uploadFilehandler(files) {
  if (!files || Object.keys(files).length === 0) {
    return {};
  }

  const fileData = {};

  await Promise.all(
    Object.entries(files).map(async ([field, fileList]) => {
      fileData[field] = await Promise.all(
        fileList.map((file) => uploadToCloudinary(file.path)),
      );
    }),
  );

  return fileData;
}
