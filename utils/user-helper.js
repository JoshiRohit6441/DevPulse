import User from "../src/model/UserSchema.js";
import { hashPassword } from "./auth-helper.js";

// find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (
  name,
  email,
  password,
  role = "User",
  profilePicture = [],
) => {
  const payload = {
    name,
    email,
    password: await hashPassword(password),
    role,
    status: "Active",
    profilePicture: profilePicture[0],
    isEmailVerified: false,
  };

  return await User.create(payload);
};
