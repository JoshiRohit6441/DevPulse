import handleResponse from "../../utils/http-response.js";
import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0];
    return handleResponse(404, errorMessage?.msg, {}, res);
  }
  next();
};

// register user validation
export const registerUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  handleValidationErrors,
];

// verify OTP validation
export const verifyOTPValidation = [
  body("code").notEmpty().withMessage("Code is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("verificationId").notEmpty().withMessage("Verification ID is required"),
  handleValidationErrors,
];

// login user validation
export const loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// forgot password validation
export const forgotPasswordValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  handleValidationErrors,
];

// reset password validation
export const resetPasswordValidation = [
  body("newPassword").notEmpty().withMessage("New password is required"),
  handleValidationErrors,
];

// update profile validation
export const updateProfileValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("profilePicture").optional(),
  handleValidationErrors,
];
