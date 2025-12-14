import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  reminder: Date;
  userId: mongoose.Types.ObjectId;
}
