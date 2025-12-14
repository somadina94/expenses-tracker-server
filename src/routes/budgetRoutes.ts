import express from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route("/").get(getAllBudgets).post(createBudget);

router
  .route("/:id")
  .get(getBudgetById)
  .patch(updateBudget)
  .delete(deleteBudget);

export default router;
