import videofile from "../Models/videofile.js";
import mongoose from "mongoose";

export const likevideocontroller = async (req, res) => {
    const { id: _id } = req.params;
    const { Like } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Video unavailable...");
    }

    try {
        const updatedVideo = await videofile.findByIdAndUpdate(
            _id,
            { $set: { Like: Like } },
            { new: true } // Return updated document
        );

        res.status(200).json(updatedVideo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
