import { NODE_ENV } from "../config/envConfig.js";

// set cookie
export const setCookie = async (label, value, expiry, resp) => {
  return resp.cookie(label, value, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: expiry,
    sameSite: "lax",
  });
};

// clear cookie
export const clearCookie = async (label, resp) => {
  return resp.clearCookie(label);
};

