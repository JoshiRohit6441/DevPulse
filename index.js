import express from "express";
import {
  ADMIN_CORS_ORIGIN,
  FRONTEND_CORS_ORIGIN,
  PORT,
} from "./config/envConfig.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import handleResponse from "./utils/http-response.js";
import dbConnection from "./config/dbConfig.js";
import { cloudinaryStatus } from "./config/cloudinaryConfig.js";
import { redisConnection } from "./config/redisConfig.js";
import UserRoutes from "./src/routes/user.js";
import AdminRoutes from "./src/routes/admin.js";
const app = express();

// Middlewares
app.use(express.json({ limit: "20KB" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [ADMIN_CORS_ORIGIN, FRONTEND_CORS_ORIGIN],
    credentials: true,
  }),
);

// Connections
dbConnection();
cloudinaryStatus();
redisConnection();

// Routes
app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);

// health check
app.get("/", (req, resp) => {
  return handleResponse(200, "Server is Happy", {}, resp);
});

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
