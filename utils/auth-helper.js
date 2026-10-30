import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  DEV_OTP,
  DEV_PASSWORD,
  HASH_SALT,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
} from "../config/envConfig.js";

// Generate Auth Token
export const generateAuthToken = (id, type = "access") => {
  if (!["access", "refresh"].includes(type))
    throw new Error("Invalid Token Type");

  return jwt.sign(
    { id },
    type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET,
    {
      expiresIn:
        type === "access" ? ACCESS_TOKEN_EXPIRATION : REFRESH_TOKEN_EXPIRATION,
    },
  );
};

// Verify Auth Token
export const verifyAuthToken = (token, type = "access") => {
  if (!["access", "refresh"].includes(type))
    throw new Error("Invalid Token Type");

  return jwt.verify(
    token,
    type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET,
  );
};

// Generate OTP
export const generateOTP = (length = 6) => {
  const start = Math.pow(10, length - 1);
  const end = Math.pow(10, length) - 1;
  return NODE_ENV == "development" ? DEV_OTP : crypto.randomInt(start, end);
};

// Generate Password
export const generatePassword = (length = 10) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return NODE_ENV == "development"
    ? DEV_PASSWORD
    : Array.from(
        { length },
        () => characters[crypto.randomInt(0, characters.length)],
      ).join("");
};

// Hash Password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, Number(HASH_SALT || 10));
};

// Compare Password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateVerificationToken = (id) => {
  return `${id}-${uuidv4()}`;
};
