import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
} from "./envConfig.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
  };
  return await transporter.sendMail(mailOptions);
}
