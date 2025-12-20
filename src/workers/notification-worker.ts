import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import Notification from "../models/notificationModel.js";
import { NotificationService } from "../services/notification-service.js";
import mongoose from "mongoose";

const dbUrl = process.env.DATABASE!;
const dbPassword = process.env.DATABASE_PASSWORD!;

const DB = dbUrl.replace("<password>", dbPassword);

const connectDB = async () => {
  const database = await mongoose.connect(DB);
  if (database.STATES.connected === 1)
    console.log("DB connected successfully!!!");
};

connectDB();

export const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    try {
      const { notificationId } = job.data;
      console.log(notificationId);

      const notification = await Notification.findById(notificationId);

      if (!notification) return;

      // Idempotency guard (VERY important)
      if (notification.sentAt) return;

      await NotificationService.send(notification);
      // console.log("✅ Sent job", job.id);
    } catch (error) {
      // console.error("❌ Send failed", error);
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
