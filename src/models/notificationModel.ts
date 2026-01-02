// models/notification.model.ts
import mongoose, { type HydratedDocument } from "mongoose";
import type { INotification } from "../types/notification.js";

export type NotificationDocument = HydratedDocument<INotification>;

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    to: { type: [String], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: {
      route: String,
      params: mongoose.Schema.Types.Mixed,
      buttonText: String,
    },
    sound: { type: String, enum: ["default", null], default: "default" },
    priority: { type: String, enum: ["default", "high"], default: "default" },
    read: { type: Boolean, default: false },
    badge: Number,
    ttl: Number,
    expiration: Number,
    sentAt: Date,
    sendError: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
