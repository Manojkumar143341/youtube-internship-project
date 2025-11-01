import videofile from "../Models/videofile.js";
import { join, extname } from "path";
import ffmpeg from "fluent-ffmpeg";


export const uploadvideo = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload an .mp4 file" });

  const { filename, mimetype, path: originalPath, size } = req.file;
  const title = req.body.title;
  const channel = req.body.chanel;
  const uploader = req.body.uploader;

  const baseName = filename.replace(extname(filename), "");
  const uploadDir = "uploads";
  const outputPaths = {};

  const renditions = {
    "320p": "426x240",
    "480p": "854x480",
    "720p": "1280x720",
    "1080p": "1920x1080"
  };

  try {
    for (const [label, sizeStr] of Object.entries(renditions)) {
      const outFilename = `${baseName}-${label}.mp4`;
      const outPath = join(uploadDir, outFilename);
      await new Promise((resolve, reject) => {
        ffmpeg(originalPath)
          .outputOptions(["-c:v libx264", "-preset fast", "-crf 23"])
          .size(sizeStr)
          .output(outPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });
      outputPaths[label] = outFilename;
    }

    const record = new videofile({
      videotitle: title,
      filename,
      filetype: mimetype,
      filepath: originalPath,
      filesize: size,
      videochanel: channel,
      uploader,
      paths: outputPaths
    });

    await record.save();
    res.status(200).json({ message: "Uploaded successfully", video: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error processing video", error: err.message });
  }
};

export const getallvideos = async (req, res) => {
  try {
    const files = await videofile.find().lean();
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const watchVideo = async (req, res) => {
    const { videoId } = req.params;
    const { watchedMinutes } = req.body;
    const userId = req.user._id;

    // Add your video watch logic here (update DB, track progress, etc.)
    return res.status(200).json({
        message: `You watched ${watchedMinutes} min of video ${videoId} with your ${req.user.plan} plan`
    });
};
