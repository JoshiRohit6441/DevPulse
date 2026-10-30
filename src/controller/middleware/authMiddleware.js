import { verifyAuthToken } from "../../../utils/auth-helper.js";
import handleResponse from "../../../utils/http-response.js";
import User from "../../model/UserSchema.js";

const authMiddleware = async (req, resp, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return handleResponse(401, "Unauthorized", {}, resp);
    }

    const decodedToken = verifyAuthToken(token, "access");

    if (!decodedToken) return handleResponse(401, "Invalid Token", {}, resp);

    const user = await User.findById(decodedToken.id).select("-password -__v");

    if (!user || user.status !== "Active")
      return handleResponse(401, "User not found", {}, resp);

    req.user = user;

    return next();
  } catch (err) {
    return handleResponse(500, err.message, {}, resp);
  }
};

export default authMiddleware;
