import express from "express";
import {
  createExpense,
  getAllExpenses,
  getOneExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.post("/createExpense", createExpense);
router.get("/getAllExpenses", getAllExpenses);
router.get("/getOneExpense/:id", getOneExpense);
router.patch("/updateExpense/:id", updateExpense);
router.delete("/deleteExpense/:id", deleteExpense);

export default router;
