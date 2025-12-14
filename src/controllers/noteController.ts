import Note from "../models/noteModel.ts";
import catchAsync from "../utils/catchAsync.ts";
import AppError from "../utils/appError.ts";

import type { Request, Response, NextFunction } from "express";
import type { INote } from "../types/note.ts";

export const createNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, reminder }: INote = req.body;
    const userId = req.user!._id;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }
    const newNote = await Note.create({ title, content, reminder, userId });

    res.status(201).json({
      status: "success",
      data: { note: newNote },
    });
  }
);

export const getAllNotes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notes = await Note.find();
    res.status(200).json({
      status: "success",
      results: notes.length,
      data: { notes },
    });
  }
);

export const getNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return next(new AppError("No note found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { note },
    });
  }
);

export const updateNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      return next(new AppError("No note found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: { note: updatedNote },
    });
  }
);

export const deleteNote = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // GET /notes/:id
    const note: INote | null = await Note.findById(req.params.id);

    // Check if exists
    if (!note) {
      return next(new AppError("No note found with that ID", 404));
    }

    // DELETE /notes/:id
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
