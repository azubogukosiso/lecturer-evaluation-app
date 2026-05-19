import Redis from "ioredis";

const redisConnection = new Redis(
  process.env.REDIS_URL as string,
  {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    // tls: process.env.NODE_ENV === "production" ? {} : undefined,
  },
);

redisConnection.on("connect", () => console.log("Redis connected"));
redisConnection.on("error", (err) => console.error("Redis error:", err));

export default redisConnection;
