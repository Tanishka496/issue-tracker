const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');

// ...existing code...

// Get tasks for a project
router.get('/:projectId/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title required' });

    const task = new Task({
      title,
      project: req.params.projectId
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;