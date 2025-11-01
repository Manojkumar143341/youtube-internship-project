import videofile from "../Models/videofile.js";
import mongoose from "mongoose";

export const viewscontroller = async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid video ID" });
    }

    try {
        const video = await videofile.findById(_id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const updatedVideo = await videofile.findByIdAndUpdate(
            _id,
            { $set: { views: (video.views || 0) + 1 } },
            { new: true }
        );

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
