import { verifyAuthToken } from "../../../utils/auth-helper.js";
import handleResponse from "../../../utils/http-response.js";
import User from "../../model/UserSchema.js";

const passwordResetMiddleware = async (req, resp, next) => {
  try {
    const token = req.cookies.passwordReset;

    if (!token) return handleResponse(401, "Invalid token", {}, resp);

    const decoded = verifyAuthToken(token, "access");

    if (!decoded) return handleResponse(401, "Invalid token", {}, resp);

    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user || user.status !== "Active")
      return handleResponse(401, "User not found", {}, resp);

    req.user = user;

    return next();
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

export default passwordResetMiddleware;
