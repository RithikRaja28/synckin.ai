const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FamilyTask = require("../../models/Family Model/FamilyTask");

const verifyToken = (req) => {
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

// Create Task
router.post("/tasks", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { title, description, dueDate, assignedTo, familyId } = req.body;

  try {
    const task = new FamilyTask({
      title,
      description,
      dueDate,
      assignedBy: userId,
      assignedTo,
      familyId,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).send("Server Error");
  }
});

// Fetch Tasks
router.get("/tasks/:assignedTo", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { assignedTo } = req.params;

  try {
    const tasks = await FamilyTask.find({ assignedTo }).populate(
      "assignedBy",
      "username"
    );
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update Task
router.put("/tasks/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { title, description, dueDate } = req.body;

  try {
    const task = await FamilyTask.findByIdAndUpdate(
      req.params.id,
      { title, description, dueDate },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).send("Server Error");
  }
});

// Delete Task
router.delete("/tasks/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    await FamilyTask.findByIdAndDelete(req.params.id);
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
