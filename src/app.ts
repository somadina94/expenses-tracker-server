import express from "express";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import userRouter from "./routes/userRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import noteRouter from "./routes/noteRoutes.js";

import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/notes", noteRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
