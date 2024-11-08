const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FamilySavings = require("../../models/Family Model/FamilySavings");
const User = require("../../models/User"); // Make sure to import the User model

const verifyToken = async (req) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    console.log("No token provided");
    return null;
  }
  try {
    const decoded = jwt.verify(token, "yourJWTSecret");
    const user = await User.findById(decoded.user.id); // Fetch user to get role
    if (!user) return null;
    return { userId: user._id, role: user.role }; // Return userId and role
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
};

router.post("/savings", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).send("Unauthorized");

  if (user.role !== "Parent") {
    return res.status(403).send("Forbidden: Only parents can add savings.");
  }

  const { goal, amount, targetDate, assignedTo, familyId } = req.body;

  try {
    const savings = new FamilySavings({
      goal,
      amount,
      targetDate,
      contributedBy: user.userId,
      assignedTo,
      familyId,
    });
    await savings.save();
    console.log("Savings created:", savings);
    res.json(savings);
  } catch (err) {
    console.error("Error creating savings:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/savings/:assignedTo", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).send("Unauthorized");

  const { assignedTo } = req.params;

  try {
    const savings = await FamilySavings.find({ assignedTo }).populate(
      "contributedBy",
      "username"
    );
    console.log("Savings found:", savings);
    res.json(savings);
  } catch (err) {
    console.error("Error fetching savings:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update Savings
router.put("/savings/:id", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).send("Unauthorized");

  if (user.role !== "Parent") {
    return res.status(403).send("Forbidden: Only parents can update savings.");
  }

  const { goal, amount, targetDate } = req.body;

  try {
    const savings = await FamilySavings.findByIdAndUpdate(
      req.params.id,
      { goal, amount, targetDate },
      { new: true }
    );

    if (!savings) {
      return res.status(404).send("Savings not found");
    }

    res.json(savings);
  } catch (err) {
    console.error("Error updating savings:", err.message);
    res.status(500).send("Server Error");
  }
});

// Delete Savings
router.delete("/savings/:id", async (req, res) => {
  const user = await verifyToken(req);
  if (!user) return res.status(401).send("Unauthorized");

  if (user.role !== "Parent") {
    return res.status(403).send("Forbidden: Only parents can delete savings.");
  }

  try {
    const savings = await FamilySavings.findByIdAndDelete(req.params.id);

    if (!savings) {
      return res.status(404).send("Savings not found");
    }

    res.sendStatus(204); // No Content
  } catch (err) {
    console.error("Error deleting savings:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
