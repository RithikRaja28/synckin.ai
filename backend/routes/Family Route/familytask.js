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

router.post("/tasks", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { title, description, dueDate, assignedTo, familyId } = req.body;

  console.log(`Adding task for user ${assignedTo} in family ${familyId}`);

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
    console.log("Task created:", task);
    res.json(task);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/tasks/:assignedTo", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { assignedTo } = req.params;

  console.log(`Fetching tasks assigned to ${assignedTo}`);

  try {
    const tasks = await FamilyTask.find({ assignedTo }).populate(
      "assignedBy",
      "username"
    );
    console.log("Tasks found:", tasks);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).send("Server Error");
  }
});




module.exports = router;