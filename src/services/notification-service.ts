import mongoose from "mongoose";
import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import Notification from "../models/notificationModel.js";
import type { INotification } from "../types/notification.js";
import type { NotificationDocument } from "../models/notificationModel.js";
import webPush from "web-push";
import User from "../models/userModel.js";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webPush.setVapidDetails(
  "mailto:support@jahbyte.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

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
  static async send(notification: NotificationDocument): Promise<any> {
    try {
      const expoMessages: ExpoPushMessage[] = notification.to
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

      const expoResponse = expoMessages.length
        ? await expo.sendPushNotificationsAsync(expoMessages)
        : [];

      // ---- WEB PUSH ----
      // Assume notification.userId references the recipient user
      const user = await User.findById(notification.userId).lean();
      const webPushTokens = user?.webPushToken ?? [];

      const webPushResponses = await Promise.all(
        webPushTokens.map(async (token) => {
          try {
            await webPush.sendNotification(
              token,
              JSON.stringify({
                title: notification.title,
                body: notification.body,
                data: notification.data,
                notificationId: notification._id,
              })
            );
            return { status: "ok", token: token.endpoint };
          } catch (err: any) {
            return {
              status: "error",
              token: token.endpoint,
              message: err.message,
            };
          }
        })
      );

      // ---- UPDATE NOTIFICATION STATUS ----
      const errors = [
        ...expoResponse
          .filter((el) => el.status !== "ok")
          .map((el) => el.message),
        ...webPushResponses
          .filter((el) => el.status === "error")
          .map((el) => el.message),
      ];

      await Notification.findByIdAndUpdate(notification._id, {
        sentAt: new Date(),
        sendError: errors.length ? errors.join("; ") : null,
      });

      return { expo: expoResponse, web: webPushResponses };
    } catch (err) {
      await Notification.findByIdAndUpdate(notification._id, {
        sendError: err instanceof Error ? err.message : "Unknown send error",
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
