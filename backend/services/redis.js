const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null, // Critical: don't crash on failed requests
});

redis.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    console.warn("⚠️ Redis not found at 127.0.0.1:6379. Is the Docker container running?");
  } else {
    console.error("❌ Redis Error:", err.message);
  }
});

redis.on("connect", () => {
  console.log("✅ Successfully connected to Redis");
});

module.exports = redis;
