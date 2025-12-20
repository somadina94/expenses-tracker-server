import type { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string | null;
  passwordResetTokenExpires?: Date | null;
  createdAt?: Date;
  country?: string;
  currency?: string;
  expoPushToken?: string[];

  // Methods
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfterJWT(JWTTimestamp: number | undefined): boolean;
}
