import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { MULTER_UPLOAD_PATH } from "./envConfig.js";
import { uploadFilehandler } from "../utils/cloudinary-helper.js";

const isDirectorExist = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return true;
};

const storage = (uploadPath) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      isDirectorExist(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const name = `${uuidv4()}.${path.extname(file.originalname)}`;
      cb(null, name);
    },
  });
};

const upload = (uploadPath) => multer({ storage: storage(uploadPath) });

const fileUpoad = () => {
  const uploadMiddleware = upload(MULTER_UPLOAD_PATH);

  return (fields) => async (req, resp, next) =>
    uploadMiddleware.fields(fields)(req, resp, async (error) => {
      if (error) {
        return next(error);
      }

      try {
        req.files = await uploadFilehandler(req.files);
        return next();
      } catch (err) {
        return next(err);
      }
    });
};

export default fileUpoad;
