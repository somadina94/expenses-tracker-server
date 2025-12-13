import express from "express";
import {
  signUp,
  forgotPassword,
  login,
  logout,
  protect,
  resetPassowrd,
  restrictTo,
  updatePassword,
} from "../controllers/authController.ts";
import {
  getAllUsers,
  getMe,
  getOneUser,
  updateMe,
} from "../controllers/userController.ts";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassowrd);

router.use(protect);

router.patch("/updatePassword", updatePassword);

router.get("/getAllUsers", restrictTo("admin"), getAllUsers);

router.get("/getOneUser/:id", restrictTo("admin"), getOneUser);

router.get("/me", getMe);

router.patch("/updateMe", updateMe);

export default router;
