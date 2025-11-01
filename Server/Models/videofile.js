import mongoose from "mongoose";

const videofileschema = new mongoose.Schema({
  videotitle: { type: String, required: true },
  filename: { type: String, required: true },
  filetype: { type: String, required: true },
  filepath: { type: String, required: true },
  filesize: { type: Number, required: true },
  videochanel: { type: String, required: true },
  uploader: { type: String },
  paths: {
    "320p": String,
    "480p": String,
    "720p": String,
    "1080p": String
  },
  Like: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Videofiles", videofileschema);
