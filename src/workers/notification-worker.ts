import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import Notification from "../models/notificationModel.js";
import { NotificationService } from "../services/notification-service.js";

export const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { notificationId } = job.data;

    const notification = await Notification.findById(notificationId);

    if (!notification) return;

    // Idempotency guard (VERY important)
    if (notification.sentAt) return;

    await NotificationService.send(notification);
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
