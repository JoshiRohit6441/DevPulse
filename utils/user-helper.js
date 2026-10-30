import User from "../src/model/UserSchema.js";
import { hashPassword } from "./auth-helper.js";

// find user by email
export const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw new Error(err?.message);
  }
};

// create user
export const createUser = async (
  name,
  email,
  password,
  role = "User",
  profilePicture = [],
) => {
  try {
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
  } catch (err) {
    throw new Error(err?.message);
  }
};

// update password
export const updatePassword = async (userId, newPassword) => {
  try {
    return await User.findByIdAndUpdate(userId, {
      $set: {
        password: await hashPassword(newPassword),
      },
    });
  } catch (err) {
    throw new Error(err?.message);
  }
};

// add update profile
export const updateProfile = async (userId, name, profilePicture = []) => {
  try {
    return await User.findByIdAndUpdate(userId, {
      $set: {
        name,
        profilePicture: profilePicture[0],
      },
    });
  } catch (err) {
    throw new Error(err?.message);
  }
};
