import history from "../Models/history.js";
import users from "../Models/Auth.js";

export const historycontroller = async (req, res) => {
    const historydata = req.body;
    const addtohistory = new history(historydata);

    try {
        await addtohistory.save();

        // Count total videos watched by this user
        const totalWatched = await history.countDocuments({ viewer: historydata.viewer });

        // Calculate points: 5 points per video watched
        const newPoints = totalWatched * 5;

        // Update user profile with new points
        await users.findByIdAndUpdate(historydata.viewer, { $set: { points: newPoints } });

        res.status(200).json("Added to history and updated points.");
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const getallhistorycontroller = async (req, res) => {
    try {
        const files = await history.find();
        res.status(200).send(files);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const deletehistory = async (req, res) => {
    const { userid } = req.params;
    try {
        await history.deleteMany({ viewer: userid });

        // Reset points to 0 after clearing history
        await users.findByIdAndUpdate(userid, { $set: { points: 0 } });

        res.status(200).json({ message: "Removed from history and reset points." });
    } catch (error) {
        res.status(400).json(error.message);
    }
};
