import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
  name: String,
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  subscriptionPlan: { type: String, default: "Free" }, // Free, Bronze, etc.
});

export default mongoose.model("Channel", channelSchema);
