import express from "express";
import handleResponse from "../../utils/http-response.js";
import { registerUser } from "../controller/user/userAuthController.js";
import { registerUserValidation } from "../validations/AuthValidation.js";
import { profileImageUpload } from "../../utils/file-upload.js";

const router = express.Router();

// ============================AUTH API=================================
// register user
router.post("/register",profileImageUpload, registerUserValidation, registerUser);

// user api health check
router.get("/", (req, resp) => {
  return handleResponse(200, "User API is running", {}, resp);
});
export default router;
