import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), "config.env"),
});

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
