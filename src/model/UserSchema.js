import mongoose from "mongoose";
import { USER_ROLES, USER_STATUS } from "../../utils/enums.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: USER_ROLES,
      default: "User",
    },
    status: {
      type: String,
      required: true,
      enum: USER_STATUS,
      default: "Inactive",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: {
      getters: true,
    },
  },
);

UserSchema.post("save", function (error, doc, next) {
  if (error.code === 11000 && error.keyPattern?.email) {
    next(new Error("Email already exists"));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
