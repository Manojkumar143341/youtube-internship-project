import express from "express";
import {
  postComment,
  getComments,
  deleteComment,
  editComment,
  likeComment,
  dislikeComment
} from "../Controllers/commentController.js"; // Make sure file name matches actual controller file

import auth from "../middleware/AuthMiddleware.js";

const router = express.Router();

// 📌 Add new comment
router.post("/post", auth, postComment);

// 📌 Get all comments for a video
router.get("/get/:videoId", getComments);

// 📌 Delete a comment
router.delete("/delete/:id", auth, deleteComment);

// 📌 Edit a comment
router.patch("/edit/:id", auth, editComment);

// 📌 Like a comment
router.patch("/like/:id", auth, likeComment);

// 📌 Dislike a comment (auto-delete after 2 dislikes)
router.patch("/dislike/:id", auth, dislikeComment);

export default router;
