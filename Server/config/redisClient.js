import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export async function initRedis() {
//   await redisClient.connect();
  redisClient.url = "redis://localhost:6379";
  console.log("Redis connected successfully!");
}