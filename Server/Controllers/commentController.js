import Comment from "../Models/comment.js";
import mongoose from "mongoose";
import geoip from "geoip-lite";

// Helper function to check for special characters
const hasSpecialCharacters = (str) => /[^a-zA-Z0-9\s.,!?]/.test(str);

// 📌 Add new comment
export const postComment = async (req, res) => {
    const { commentBody, userId, userCommented, videoId, language } = req.body;

    if (!commentBody || hasSpecialCharacters(commentBody)) {
        return res.status(400).json("Comment contains invalid/special characters or is empty.");
    }

    // Get city from IP
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const city = geo?.city || "Unknown";

    const newComment = new Comment({
        commentBody,
        userId,
        userCommented,
        videoId,
        language,
        city,
        likes: 0,
        dislikes: 0
    });

    try {
        await newComment.save();
        res.status(200).json("Comment posted successfully.");
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// 📌 Get all comments for a video
export const getComments = async (req, res) => {
    try {
        const { videoId } = req.params;
        const commentList = await Comment.find({ videoId }).sort({ commentedOn: -1 });
        res.status(200).json(commentList);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// 📌 Delete a comment
export const deleteComment = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Invalid comment ID");
    }
    try {
        await Comment.findByIdAndDelete(_id);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// 📌 Edit a comment
export const editComment = async (req, res) => {
    const { id: _id } = req.params;
    const { commentBody } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Invalid comment ID");
    }

    if (!commentBody || hasSpecialCharacters(commentBody)) {
        return res.status(400).json("Comment contains invalid characters.");
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            _id,
            { $set: { commentBody } },
            { new: true }
        );
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// 📌 Like a comment
export const likeComment = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Invalid comment ID");
    }
    try {
        const updated = await Comment.findByIdAndUpdate(
            _id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// 📌 Dislike a comment (Auto-delete if > 2 dislikes)
export const dislikeComment = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send("Invalid comment ID");
    }
    try {
        const updated = await Comment.findByIdAndUpdate(
            _id,
            { $inc: { dislikes: 1 } },
            { new: true }
        );

        if (updated.dislikes >= 2) {
            await Comment.findByIdAndDelete(_id);
            return res.status(200).json({ message: "Comment auto-deleted due to dislikes." });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json(error.message);
    }
};
