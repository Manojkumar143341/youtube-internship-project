import WatchLater from "../Models/WatchLater.js"; // or your model path

const watchlatercontroller = async (req, res) => {
  // your logic
};

const getallwatchlatercontroller = async (req, res) => {
  // your logic
};

const deletewatchlater = async (req, res) => {
  try {
    const { videoid, viewer } = req.params;
    await WatchLater.deleteOne({ videoid, viewer });
    res.status(200).json({ message: "Watch later entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export {
  watchlatercontroller,
  getallwatchlatercontroller,
  deletewatchlater
};
