import Notification from "../models/notificationModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

import type { Request, Response, NextFunction } from "express";
import type { INotification } from "../types/notification.js";

/**
 * Get all notifications for the authenticated user
 * Optional date filtering with startDate/endDate query params
 */
export const getAllNotifications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications: INotification[] = await Notification.find({
      userId: req.user!._id,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: "success",
      results: notifications.length,
      data: { notifications },
    });
  }
);

/**
 * Get a single notification by ID
 */
export const getNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError("No notification found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { notification },
    });
  }
);

/**
 * Update a notification by ID
 */
export const updateNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return next(new AppError("No notification found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Notification updated successfully",
      data: { notification: updatedNotification },
    });
  }
);

/**
 * Delete a notification by ID
 */
export const deleteNotification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError("No notification found with that ID", 404));
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  }
);

/**
 * Mark a notification as read
 */
export const markAsRead = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return next(new AppError("No notification found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
      data: { notification },
    });
  }
);
