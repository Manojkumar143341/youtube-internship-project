import mongoose from "mongoose";

const commentschema = mongoose.Schema({
  videoid: { type: String, required: true },
  userid: { type: String, required: true },
  commentbody: { type: String, required: true },
  usercommented: { type: String, required: true },
  commentedon: { type: Date, default: Date.now },
  likes: { type: [String], default: [] },    // store user IDs who liked
  dislikes: { type: [String], default: [] }  // store user IDs who disliked
});

// ✅ Use existing model if already compiled
const Comments = mongoose.models.Comments || mongoose.model("Comments", commentschema);

export default Comments;
