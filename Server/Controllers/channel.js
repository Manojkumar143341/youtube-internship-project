import Channel from "../Models/Channel.js";

export const updatechaneldata = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedChannel = await Channel.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedChannel);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

export const getallchanels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Fetching channels failed", error });
  }
};

export const getUserChannels = async (req, res) => {
  const userId = req.userId;
  try {
    const userChannels = await Channel.find({ creator: userId });
    res.status(200).json(userChannels);
  } catch (error) {
    res.status(500).json({ message: "Fetching user channels failed", error });
  }
};
