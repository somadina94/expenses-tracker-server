import { IUser } from "./user.ts"; // adjust the path to your IUser type

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // optional user property
    }
  }
}
