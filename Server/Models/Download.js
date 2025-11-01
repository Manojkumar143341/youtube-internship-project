// Server/models/Download.js
import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  downloadedAt: { type: Date, default: Date.now },
});

// ✅ Use export default (ESM)
const Download = mongoose.model("Download", downloadSchema);
export default Download;
