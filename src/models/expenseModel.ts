import mongoose from "mongoose";
import type IExpense from "../types/expense.ts";

const expenseSchema = new mongoose.Schema<IExpense>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Expense = mongoose.model<IExpense>("Expense", expenseSchema);

export default Expense;
