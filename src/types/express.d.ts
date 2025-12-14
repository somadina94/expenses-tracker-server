import type { IUser } from "./user.js"; // adjust the path to your IUser type

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // optional user property
    }
  }
}
