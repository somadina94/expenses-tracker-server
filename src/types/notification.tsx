import mongoose from "mongoose";

export interface INotification {
  to: string[];
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  data?: {
    route?: string;
    params?: Record<string, unknown>;
    buttonText?: string;
  };
  sound?: "default" | null;
  priority?: "default" | "high";
  read: boolean;
  badge?: number;
  ttl?: number;
  expiration?: number;
  sentAt?: Date;
  sendError?: string;
  createdAt?: Date;
}
