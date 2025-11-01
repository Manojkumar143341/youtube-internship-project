import Group from "../Models/group.js";

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups" });
  }
};



// controllers/groups.js

export const createGroup = (req, res) => {
  const { groupName } = req.body;
  res.status(200).json({ message: `Group '${groupName}' created successfully` });
};

export const getAllGroups = (req, res) => {
  res.status(200).json([{ groupName: "Test Group" }]); // Mocked data
};
