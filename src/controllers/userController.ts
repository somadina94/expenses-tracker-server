import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../types/user.js";

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

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET /notes/:id
    const user: IUser | null = await User.findById(req.user!._id);

    // Check if exists
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // DELETE /notes/:id
    await User.findOneAndDelete(req.user!._id);
    res.status(200).json({
      status: "success",
      message: "Your data has been completed deleted",
    });
  }
);
