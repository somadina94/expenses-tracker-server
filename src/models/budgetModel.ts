import mongoose from "mongoose";
import type { IBudget } from "../types/budget.js";

const budgetSchema = new mongoose.Schema<IBudget>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
});
const Budget = mongoose.model<IBudget>("Budget", budgetSchema);

export default Budget;
