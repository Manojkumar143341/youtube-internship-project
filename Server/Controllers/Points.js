// Controllers/Points.js
import users from "../Models/Auth.js";

export const addUserPoints = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await users.findById(userId);
    if (!user) return res.status(404).json("User not found");

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $inc: { points: 5 } },
      { new: true }
    );
    res.status(200).json({ message: "Points added", updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
