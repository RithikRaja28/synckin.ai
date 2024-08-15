const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Task = require("../models/Tasks");

const verifyToken = async (req) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    console.log("No token");
    return null;
  }
  try {
    const decoded = jwt.verify(token, "yourJWTSecret");
    return decoded.user.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};


router.post("/add", async (req, res) => {
  const userId = await verifyToken(req); // Use await here
  if (!userId) {
    console.log("Invalid token");
    return res.status(401).send("Unauthorized"); // Return to stop further execution
  }

  try {
    const { taskName, description, dueDate, priority, status } = req.body;

    if (!taskName) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const newTask = new Task({
      taskName,
      description,
      dueDate,
      priority,
      status,
      userId,
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


router.get("/show", async (req, res) => {
  const userId = await verifyToken(req); // Use await here
  if (!userId) {
    console.log("Invalid token");
    return res.status(401).send("Unauthorized"); // Return to stop further execution
  }
  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


router.put("/update/:id", async (req, res) => {
  const userId = await verifyToken(req); // Use await here
  if (!userId) {
    console.log("Invalid token");
    return res.status(401).send("Unauthorized"); // Return to stop further execution
  }

  const { taskName, description, dueDate, priority, status } = req.body;

  if (!taskName) {
    return res.status(400).json({ message: "Task name is required" });
  }

  const updatedTask = {
    taskName,
    description,
    dueDate,
    priority,
    status,
    updatedAt: Date.now(),
  };

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedTask },
      { new: true, runValidators: true }
    );
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});




router.delete("/delete/:id", async (req, res) => {
  const userId = await verifyToken(req); // Use await here
  if (!userId) {
    console.log("Invalid token");
    return res.status(401).send("Unauthorized"); // Return to stop further execution
  }
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId,
    });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


module.exports = router;