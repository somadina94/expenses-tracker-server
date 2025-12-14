import User from "../models/userModel.ts";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/appError.ts";

import type { Request, Response, NextFunction } from "express";

// GET ALL USERS
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Fetch users
    const users = await User.find({ role: "user" });

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  }
);

// GET ONE USER
export const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user
    const user = await User.findById(req.params.id);

    // Return error is no user with id
    if (!user) {
      return next(new AppError("No user found with that Id", 404));
    }

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// UPDATE USER
export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if body has password field and return error
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError("You cannot update password with this route", 401)
      );
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
    });

    // Send response
    res.status(200).json({
      status: "success",
      message: "Your account has been updated successfully",
      data: {
        user: updatedUser,
      },
    });
  }
);

// GET ME
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get current user
    const user = req.user;

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

// Set exposeNotificationsToken
export const setExpoPushToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from body
    const { expoPushToken } = req.body;
    if (!expoPushToken) {
      return next(
        new AppError("Please provide a valid expose notifications token", 400)
      );
    }
    // Update user with token
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { expoPushToken },
      { new: true }
    );
    // Send response
    res.status(200).json({
      status: "success",
      message: "Expose notifications token set successfully",
      data: {
        user: updatedUser,
      },
    });
  }
);
