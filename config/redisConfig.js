import Redis from "ioredis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "./envConfig.js";

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

export const redisConnection = async () => {
  redis.on("connect", () => {
    console.log("[INFO] Successfully Connected To Redis");
  });
  redis.on("error", (err) => {
    console.log("[ERROR] Unable To Connect To Redis");
  });
};

export default redis;
