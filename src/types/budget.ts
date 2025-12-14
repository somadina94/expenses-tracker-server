import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  month: number;
  year: number;
}
