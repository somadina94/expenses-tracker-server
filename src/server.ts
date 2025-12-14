process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION");
  console.error(err);
  console.error(err instanceof Error ? err.stack : "Not an Error");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 UNHANDLED REJECTION");
  console.error(reason);
  process.exit(1);
});

import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE!.replace(
  "<password>",
  process.env.DATABASE_PASSWORD!
);

const server = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const connectDB = async () => {
  const database = await mongoose.connect(DB);
  if (database.STATES.connected === 1)
    console.log("DB connected successfully!!!");
};

connectDB();

// "exec": "node --trace-warnings --loader ts-node/esm ./src/server.ts"

// "exec": "node -r ts-node/register ./src/server.ts"
