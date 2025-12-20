import mongoose from "mongoose";
import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import Notification from "../models/notificationModel.js";
import type { INotification } from "../types/notification.js";
import type { NotificationDocument } from "../models/notificationModel.js";

const expo = new Expo();

interface CreateNotificationInput {
  userId: mongoose.Types.ObjectId;
  to: string[];
  title: string;
  body: string;
  data?: {
    route?: string;
    params?: Record<string, unknown>;
    buttonText?: string;
  };
  sound?: "default" | null;
  priority?: "default" | "high";
  badge?: number;
  ttl?: number;
  expiration?: number;
}

export class NotificationService {
  /**
   * Create notification record (DB only)
   */
  static async create(
    input: CreateNotificationInput
  ): Promise<NotificationDocument> {
    if (!input.to.length) {
      throw new Error("Cannot create notification without recipients");
    }

    return Notification.create({
      ...input,
      read: false,
    });
  }

  /**
   * Send notification via Expo and update status
   */
  static async send(notification: NotificationDocument): Promise<void> {
    try {
      const messages: ExpoPushMessage[] = notification.to
        .filter((token) => Expo.isExpoPushToken(token))
        .map((token) => ({
          to: token,
          title: notification.title,
          body: notification.body,
          data: notification.data as Record<string, unknown>,
          sound: notification.sound ?? "default",
          priority: notification.priority ?? "default",
          badge: notification.badge as number,
          ttl: notification.ttl as number,
          expiration: notification.expiration as number,
        }));

      if (!messages.length) {
        throw new Error("No valid Expo push tokens");
      }

      await expo.sendPushNotificationsAsync(messages);

      await Notification.findByIdAndUpdate(notification._id, {
        sentAt: new Date(),
        sendError: null,
      });
    } catch (err) {
      await Notification.findByIdAndUpdate(notification._id, {
        sendError:
          err instanceof Error ? err.message : "Unknown Expo send error",
      });

      throw err;
    }
  }

  /**
   * Generic update method (retry, mark read, admin fixes, etc.)
   */
  static async update(
    notificationId: mongoose.Types.ObjectId,
    update: Partial<Pick<INotification, "sentAt" | "sendError" | "read">>
  ): Promise<NotificationDocument | null> {
    return Notification.findByIdAndUpdate(notificationId, update, {
      new: true,
    });
  }
}
