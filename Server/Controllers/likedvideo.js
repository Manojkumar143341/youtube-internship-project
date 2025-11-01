import likedvideo from "../Models/likevideo.js";

export const likedvideocontroller = async (req, res) => {
    const likedvidedata = req.body;
    const likedvideosave = new likedvideo(likedvidedata);
    
    try {
        await likedvideosave.save();
        res.status(200).json("Added to liked videos");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getalllikedvideo = async (req, res) => {
    try {
        const files = await likedvideo.find();
        res.status(200).json(files);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletelikedvideo = async (req, res) => {
    const { videoid, viewer } = req.params;

    try {
        await likedvideo.findOneAndDelete({ videoid, viewer });
        res.status(200).json({ message: "Removed from liked videos" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
