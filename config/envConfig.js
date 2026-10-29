import dotenv from "dotenv";

dotenv.config({ quiet: true });

// PORT
export const PORT = process.env.PORT;

// ENVIRONMENT
export const NODE_ENV = process.env.NODE_ENV;
export const DEV_OTP = process.env.DEV_OTP;
export const DEV_PASSWORD = process.env.DEV_PASSWORD;
// DB URL
export const DB_URL = process.env.DB_URL;

// CORS ORIGINs
export const ADMIN_CORS_ORIGIN = process.env.ADMIN_CORS_ORIGIN;
export const FRONTEND_CORS_ORIGIN = process.env.FRONTEND_CORS_ORIGIN;

// MAIL CONFIG
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_SECURE = process.env.EMAIL_SECURE;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// CLOUDINARY CONFIG
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
export const CLOUDINARY_API = process.env.CLOUDINARY_API;

// MULTER CONFIG
export const MULTER_UPLOAD_PATH = process.env.MULTER_UPLOAD_PATH;

// JSON WEB TOKEN CONFIG
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

// REDIS CONFIG
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// HASH SALT
export const HASH_SALT = process.env.HASH_SALT;
