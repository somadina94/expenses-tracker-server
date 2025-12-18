import Budget from "../models/budgetModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

import type { Request, Response, NextFunction } from "express";
import type { IBudget } from "../types/budget.js";

export const createBudget = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const budgetData: IBudget = req.body;
    budgetData.userId = req.user!._id;
    const newBudget = await Budget.create(budgetData);

    res.status(201).json({
      status: "success",
      message: "Budget created successfully",
      data: { budget: newBudget },
    });
  }
);

export const getAllBudgets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { month, year } = req.query;

    // Base query (always filter by user)
    const query: any = {
      userId: req.user!._id,
    };

    // Add filters only if they exist
    if (month) {
      query.month = Number(month);
    }

    if (year) {
      query.year = Number(year);
    }

    const budgets: IBudget[] = await Budget.find(query);
    res.status(200).json({
      status: "success",
      results: budgets.length,
      data: { budgets },
    });
  }
);

export const getBudgetById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return next(new AppError("No budget found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { budget },
    });
  }
);

export const updateBudget = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const budgetId = req.params.id;
    const budgetData: Partial<IBudget> = req.body;
    const updatedBudget = await Budget.findByIdAndUpdate(budgetId, budgetData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBudget) {
      return next(new AppError("No budget found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Budget updated successfully",
      data: { budget: updatedBudget },
    });
  }
);

export const deleteBudget = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const budgetId = req.params.id;
    // find budeget
    const budget = await Budget.findById(budgetId);

    // check if budget exists
    if (!budget) {
      return next(new AppError("No budget found with that ID", 404));
    }

    // delete budget
    await Budget.findByIdAndDelete(budgetId);

    res.status(200).json({
      status: "success",
      message: "Budget deleted successfully",
    });
  }
);
