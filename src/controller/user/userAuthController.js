import {
  comparePassword,
  generateAuthToken,
  generateOTP,
  generateVerificationToken,
  hashPassword,
} from "../../../utils/auth-helper.js";
import { setCookie } from "../../../utils/cookie-helper.js";
import handleResponse from "../../../utils/http-response.js";
import {
  clearRedisData,
  getRedisData,
  setRedisData,
} from "../../../utils/redis-helper.js";
import {
  createUser,
  findUserByEmail,
  updatePassword,
} from "../../../utils/user-helper.js";
import User from "../../model/UserSchema.js";

// register user
export const registerUser = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser)
      return handleResponse(404, "User Already Exists", {}, resp);

    const { profilePicture } = req.files;

    const user = await createUser(
      name,
      email,
      password,
      "User",
      profilePicture,
    );

    if (!user) return handleResponse(400, "Failed to Create User", {}, resp);

    const [verificationId, verificationOTP] = await Promise.all([
      generateVerificationToken(user._id?.toString()),
      generateOTP(),
    ]);

    const data = {
      code: verificationOTP,
      userId: user._id?.toString(),
    };
    await setRedisData(
      `verification:${verificationId}`,
      JSON.stringify(data),
      2, //15 minutes
    );

    return handleResponse(
      200,
      "User Registered Successfully and email successfully send to registered email",
      { verificationId },
      resp,
    );
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// verify code
export const verifyAuthCode = async (req, resp) => {
  try {
    const { code, type, verificationId } = req.body;

    if (!["email-verification", "password-reset"].includes(type))
      return handleResponse(400, "Invalid verification type", {}, resp);

    const verificationCode = await getRedisData(
      `verification:${verificationId}`,
    );

    if (!verificationCode)
      return handleResponse(400, "Invalid verification code", {}, resp);

    const data = JSON.parse(verificationCode);

    if (data?.code?.toString() !== code?.toString())
      return handleResponse(400, "Invalid verification code", {}, resp);

    const user = await User.findById(data?.userId).select("-password -__v");

    if (!user || user.status !== "Active")
      return handleResponse(400, "User not found", {}, resp);

    let isPasswordChange = false;
    let [accessToken, refreshToken] = [];
    if (type == "password-reset") {
      const token = generateAuthToken(user._id, "access");

      setCookie(
        "passwordReset",
        token,
        60 * 30, //30 minutes
        resp,
      );
      isPasswordChange = true;
    } else {
      user.isEmailVerified = true;
      await user.save();
      [accessToken, refreshToken] = await Promise.all([
        generateAuthToken(user._id, "access"),
        generateAuthToken(user._id, "refresh"),
      ]);

      setCookie(
        "refreshToken",
        refreshToken,
        60 * 60 * 24, //1 day
        resp,
      );
    }

    await clearRedisData(`verification:${verificationId}`);

    return handleResponse(
      200,
      `Account verified successfully,${isPasswordChange ? "Now you can change the password" : ""}`,

      { accessToken },
      resp,
    );
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// login user
export const loginUser = async (req, resp) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user || user.status !== "Active")
      return handleResponse(400, "Invalid email or password", {}, resp);

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid)
      return handleResponse(400, "Invalid email or password", {}, resp);

    if (!user.isEmailVerified) {
      const [verificationId, verificationOTP] = await Promise.all([
        generateVerificationToken(user._id?.toString()),
        generateOTP(),
      ]);

      setImmediate(async () => {
        const data = {
          code: verificationOTP,
          userId: user._id?.toString(),
        };
        setRedisData(
          `verification:${verificationId}`,
          JSON.stringify(data),
          2, //15 minutes
        );
      }, 1000);

      return handleResponse(
        200,
        "Email not verified, verification code sent to email",
        { verificationId },
        resp,
      );
    } else {
      const [accessToken, refreshToken] = await Promise.all([
        generateAuthToken(user._id, "access"),
        generateAuthToken(user._id, "refresh"),
      ]);

      setCookie(
        "refreshToken",
        refreshToken,
        60 * 60 * 24, //1 day
        resp,
      );

      delete user.password;

      return handleResponse(
        200,
        "Login successful",
        { accessToken, user },
        resp,
      );
    }
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// get profile
export const getProfile = async (req, resp) => {
  try {
    const user = req.user;

    return handleResponse(200, "Profile fetched successfully", { user }, resp);
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// forgot password
export const forgotPassword = async (req, resp) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) return handleResponse(400, "User not found", {}, resp);

    const [verificationId, verificationOTP] = await Promise.all([
      generateVerificationToken(user._id?.toString()),
      generateOTP(),
    ]);

    const data = {
      code: verificationOTP,
      userId: user._id?.toString(),
    };
    await setRedisData(
      `verification:${verificationId}`,
      JSON.stringify(data),
      2, //15 minutes
    );

    return handleResponse(
      200,
      "Verification Code Sucessfully Send to Email",
      { verificationId },
      resp,
    );
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// reset password
export const resetPassword = async (req, resp) => {
  try {
    const { newPassword } = req.body;
    const user = req.user;

    await updatePassword(user._id, newPassword);

    return handleResponse(200, "Password reset successfully", {}, resp);
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// update profile
export const updateProfile = async (req, resp) => {
  try {
    const { name, profilePicture } = req.body;
    const user = req.user;
    const { profilePicture: picture } = req.files;

    const profileImage = picture?.length > 0 ? picture : [profilePicture];

    await updateProfile(user._id, name, profileImage);

    return handleResponse(200, "Profile updated successfully", {}, resp);
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};
