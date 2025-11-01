import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Download from "../models/Download.js";

const router = express.Router();

// POST /api/downloads — record a download
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, fileName } = req.body;
    if (!title || !fileName) {
      return res.status(400).json({ message: "Missing title or fileName" });
    }

    const newDownload = new Download({
      user: req.user.id,
      title,
      fileName,
      downloadedAt: new Date(),
    });

    await newDownload.save();

    res.status(201).json(newDownload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/downloads — get all downloads for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const downloads = await Download.find({ user: req.user.id }).sort({
      downloadedAt: -1,
    });
    res.json(downloads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
