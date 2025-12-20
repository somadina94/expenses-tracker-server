import { Queue } from "bullmq";
import { redis } from "../lib/redis.js";

export const notificationQueue = new Queue("notifications", {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 60_000, // 1 minute
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
