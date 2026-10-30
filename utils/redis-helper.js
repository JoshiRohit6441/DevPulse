import redis from "../config/redisConfig.js";

// set redis
export const setRedisData = async (key, value, expiration) => {
  await redis.set(key, value, "EX", expiration * 60);
};

// get redis data
export const getRedisData = async (key) => {
  return await redis.get(key);
};

//
// clear redis data
export const clearRedisData = async (key) => {
  await redis.del(key);
};
