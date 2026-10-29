import { generateAuthToken, generateOTP } from "../../../utils/auth-helper.js";
import { setCookie } from "../../../utils/cookie-helper.js";
import handleResponse from "../../../utils/http-response.js";
import { setRedisData } from "../../../utils/redis-helper.js";
import { createUser, findUserByEmail } from "../../../utils/user-helper.js";

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

    const [verificationToken, verificationOTP] = await Promise.all([
      generateAuthToken(user._id, "access"),
      generateOTP(),
    ]);

    setImmediate(async () => {
      await Promise.all([
        setCookie(
          "email-verification",
          verificationToken,
          1 * 60 * 60 * 24,
          resp,
        ),
        setRedisData(
          `email-verification:${user._id}`,
          verificationOTP,
          15, //15 minutes
        ),
      ]);
    }, 1000);

    return handleResponse(
      200,
      "User Registered Successfully and email successfully send to registered email",
      {},
      resp,
    );
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};

// verify OTP
export const verifyOTP = async (req, resp) => {
  try {
    const { otp } = req.body;

    const user = req.user;


    return handleResponse(200, "OTP Verified Successfully", {}, resp);
  } catch (err) {
    return handleResponse(500, err?.message, {}, resp);
  }
};
