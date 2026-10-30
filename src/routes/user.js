import express from "express";
import handleResponse from "../../utils/http-response.js";
import {
  forgotPassword,
  getProfile,
  loginUser,
  registerUser,
  resetPassword,
  verifyAuthCode,
} from "../controller/user/userAuthController.js";
import {
  forgotPasswordValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
  updateProfileValidation,
  verifyOTPValidation,
} from "../validations/AuthValidation.js";
import { profileImageUpload } from "../../utils/file-upload.js";
import { updateProfile } from "../../utils/user-helper.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passwordResetMiddleware from "../middleware/passwordResetMiddleware.js";

const router = express.Router();

// ============================AUTH API=================================
// register user
router.post(
  "/register",
  profileImageUpload,
  registerUserValidation,
  registerUser,
);

// verify account
router.post("/verify-account", verifyOTPValidation, verifyAuthCode);

// login user
router.post("/login", loginUserValidation, loginUser);

// get profile
router.get("/profile", authMiddleware, getProfile);

// forgot password
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);

// reset password
router.post(
  "/reset-password",
  resetPasswordValidation,
  passwordResetMiddleware,
  resetPassword,
);

// update profile
router.put(
  "/update-profile",
  profileImageUpload,
  updateProfileValidation,
  authMiddleware,
  updateProfile,
);

// user api health check
router.get("/", (req, resp) => {
  return handleResponse(200, "User API is running", {}, resp);
});
export default router;
