const express = require("express");
const auth = require("../middlewares/auth");
const Task = require("../models/Task");
const { findOne } = require("../models/User");

const router = express.Router();

router.get("/test", auth, (req, res) => {
  res.json({
    message: "Task routes are working",
    user: req.user,
  });
});

// CRUD task

// Create Task
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).json({ task, message: "Task Created succesfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// get task user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user._id,
    });

    res.status(201).json({
      tasks,
      count: tasks.length,
      message: "Tasks fetched succesfully",
    });
  } catch (error) {}
});

// get tasks by id
router.get("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({
      _id: taskId,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found!",
      });
    }

    res
      .status(201)
      .json({ task, message: `Task by ${taskId} fetched successfully` });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// update task by id
router.patch("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "isCompleted", "title"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).json({ message: "Task not found" });
  }

  try {
    const task = await Task.findOne({
      _id: taskId,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(201).json({ task, message: "Task update successfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

//delete task by id
router.delete("/:id", auth, async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id: taskId,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).json({
        task,
        message: "Task not found",
      });
    }
    res.status(201).json({ task, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
