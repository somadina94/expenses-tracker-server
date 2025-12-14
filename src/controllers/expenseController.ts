import Expense from "../models/expenseModel.ts";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/appError.ts";

import type { Request, Response, NextFunction } from "express";
import type IExpense from "../types/expense.ts";
import { nextTick } from "node:process";

// CREATE EXPENSE
export const createExpense = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create expense
    const expense: IExpense = await Expense.create({
      title: req.body.title,
      user: req.user._id,
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date,
    });

    // Send response
    res.status(201).json({
      status: "success",
      message: "Expense created successfully",
      data: {
        expense,
      },
    });
  }
);

// GET ALL EXPENSES
export const getAllExpenses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get all expenses
    const expenses: IExpense[] = await Expense.find({ user: req.user._id });

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        expenses,
      },
    });
  }
);

// GET ONE EXPENSE
export const getOneExpense = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get expense
    const expense: IExpense | null = await Expense.findById(req.params.id);

    // Check if expense was not found
    if (!expense) {
      return next(new AppError("No expense found with that id", 404));
    }

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  }
);

// UPDATE EXPENSE
export const updateExpense = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Update expense
    const updatedExpense: IExpense | null = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    // Check if expense was not found
    if (!updatedExpense) {
      return next(new AppError("No expense found with that id", 404));
    }

    // Send response
    res.status(200).json({
      status: "success",
      message: "Expense updated successfully",
      data: {
        expense: updatedExpense,
      },
    });
  }
);

// DELETE EXPENSE
export const deleteExpense = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Delete expense
    await Expense.findByIdAndDelete(req.params.id);

    // Send response
    res.status(204).json({
      status: "success",
    });
  }
);
