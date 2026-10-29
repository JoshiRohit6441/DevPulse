import redis from "../config/redisConfig.js";

// set redis
export const setRedisData = async (key, value, expiration) => {
  await redis.set(key, value, "EX", expiration * 60);
};
