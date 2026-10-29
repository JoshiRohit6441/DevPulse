import fileUpoad from "../config/multerConfig.js";

export const profileImageUpload = fileUpoad()([
  { name: "profilePicture", maxCount: 1 },
]);
