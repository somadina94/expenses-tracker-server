import express from "express";
import globalErrorHandler from "./controllers/errorController.ts";
import AppError from "./utils/appError.ts";
import userRouter from "./routes/userRoutes.ts";
import expenseRouter from "./routes/expenseRoutes.ts";

import type { Request, Response, NextFunction } from "express";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
