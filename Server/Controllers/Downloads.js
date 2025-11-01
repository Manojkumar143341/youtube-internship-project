const fs = require('fs');
const path = require('path');
const Download = require('../Models/Download');
const Video = require('../Models/Video');

exports.handleVideoDownload = async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.body;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await Download.countDocuments({
    user: userId,
    createdAt: { $gte: today }
  });

  const userSub = req.user.subscriptionType || 'Free';

  const limits = {
    Free: 1,
    Bronze: 3,
    Silver: 10,
    Gold: 100,
  };

  const allowed = limits[userSub] || 1;

  if (count >= allowed) {
    return res.status(403).json({ message: "Daily download limit reached" });
  }

  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const download = new Download({ user: userId, video: videoId });
  await download.save();

  const filePath = path.join(__dirname, '..', 'uploads', video.filename);
  res.download(filePath);
};
