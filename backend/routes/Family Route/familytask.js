const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FamilyTask = require("../../models/Family Model/FamilyTask");
const User = require("../../models/User"); // Ensure User model is imported

const verifyToken = async (req) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    console.log("No token");
    return null;
  }
  try {
    const decoded = jwt.verify(token, "yourJWTSecret");
    const user = await User.findById(decoded.user.id); // Fetch user to get role
    if (!user) return null;
    return { userId: user._id, role: user.role }; // Return userId and role
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Create Task - Only "Parent" role can assign tasks
router.post("/tasks", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  if (user.role !== "Parent") {
    return res.status(403).send("Only parents can assign tasks.");
  }

  const { title, description, dueDate, assignedTo, familyId } = req.body;

  try {
    const task = new FamilyTask({
      title,
      description,
      dueDate,
      assignedBy: user.userId,
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

// Fetch Tasks - No role restriction
router.get("/tasks/:assignedTo", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) {
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

// Update Task - Only "Parent" role can update tasks
router.put("/tasks/:id", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  if (user.role !== "Parent") {
    return res.status(403).send("Only parents can update tasks.");
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

// Delete Task - Only "Parent" role can delete tasks
router.delete("/tasks/:id", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  if (user.role !== "Parent") {
    return res.status(403).send("Only parents can delete tasks.");
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
