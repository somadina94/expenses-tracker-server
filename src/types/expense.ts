import type { Document } from "mongoose";
import mongoose from "mongoose";

export interface IExpense extends Document {
  title: string;
  description: string;
  amount: number;
  date: Date;
  user: mongoose.Types.ObjectId;
}
