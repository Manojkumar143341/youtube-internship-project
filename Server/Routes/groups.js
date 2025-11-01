import express from 'express';
import GroupModel from '../Models/group.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = new GroupModel({ name, description });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const groups = await GroupModel.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
