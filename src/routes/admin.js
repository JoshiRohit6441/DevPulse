import express from "express";
import handleResponse from "../../utils/http-response.js";

const router = express.Router();

// admin api health check
router.get("/", (req, resp) => {
  return handleResponse(200, "Admin API is running", {}, resp);
});
export default router;
