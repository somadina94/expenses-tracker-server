import express from "express";
import {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createNote).get(getAllNotes);
router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote);

export default router;
