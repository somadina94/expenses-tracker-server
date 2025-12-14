import mongoose from "mongoose";
import type { INote } from "../types/note.ts";

const noteSchema = new mongoose.Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reminder: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
