import { sendEmail } from "../config/mailConfig.js";

export const sendVerificationCodeMail = async (email, code) => {
  try {
    await sendEmail(
      email,
      "Verification Code",
      `Your verification code is ${code}`,
    );
  } catch (err) {
    console.log(err?.message);
  }
};
