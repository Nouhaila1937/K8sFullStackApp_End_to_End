const Task = require('../models/taskModel');

// Get all tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// Create a new task
exports.createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
};

// Update a task
exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

// Delete a task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};
