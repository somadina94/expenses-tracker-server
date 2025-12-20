import { Queue } from "bullmq";
import { redis } from "./lib/redis.js";

const queue = new Queue("notifications", { connection: redis });

async function checkQueue() {
  const waiting = await queue.getWaiting();
  const active = await queue.getActive();
  const failed = await queue.getFailed();
  const completed = await queue.getCompleted();

  console.log("Waiting:", waiting.length);
  console.log("Active:", active.length);
  console.log("Failed:", failed.length);
  console.log("Completed:", completed.length);
}

checkQueue();
