import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },   // linked video
  userId: { type: String, required: true },    // who commented
  commentBody: { type: String, required: true },
  userCommented: { type: String, required: true },
  commentedOn: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },         // like counter
  dislikes: { type: Number, default: 0 }       // dislike counter
});

// ✅ Reuse if model already exists
const Comment = mongoose.models.Comments || mongoose.model("Comments", commentSchema);

export default Comment;
