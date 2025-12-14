import express from "express";
import {
  createExpense,
  getAllExpenses,
  getOneExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.ts";
import { protect } from "../controllers/authController.ts";

const router = express.Router();

router.use(protect);

router.post("/createExpense", createExpense);
router.get("/getAllExpenses", getAllExpenses);
router.get("/getOneExpense/:id", getOneExpense);
router.patch("/updateExpense/:id", updateExpense);
router.delete("/deleteExpense/:id", deleteExpense);

export default router;
