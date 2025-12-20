import express from "express";
import {
  getAllNotifications,
  getNotification,
  updateNotification,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllNotifications);
router.patch("/read/:id", markAsRead);
router
  .route("/:id")
  .get(getNotification)
  .patch(updateNotification)
  .delete(deleteNotification);

export default router;
