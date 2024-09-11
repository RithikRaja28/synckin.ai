const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SavingsGoal = require("../models/SavingsGoal");

// Verify JWT Token
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

// Create a new savings goal
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const {
    goal,
    targetAmount,
    currentAmount,
    targetDate,
    interestRate,
    frequency,
  } = req.body;

  try {
    const newSavingsGoal = new SavingsGoal({
      goal,
      targetAmount,
      currentAmount,
      targetDate,
      userId,
      interestRate,
      frequency,
    });

    const savedSavingsGoal = await newSavingsGoal.save();
    res.json(savedSavingsGoal);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get all savings goals for a user
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const savingsGoals = await SavingsGoal.find({ userId });
    res.json(savingsGoals);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Update a savings goal
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const {
    goal,
    targetAmount,
    currentAmount,
    targetDate,
    interestRate,
    frequency,
  } = req.body;

  try {
    let savingsGoal = await SavingsGoal.findOne({ _id: req.params.id, userId });
    if (!savingsGoal) {
      return res.status(404).json({ msg: "Savings goal not found" });
    }

    savingsGoal.goal = goal || savingsGoal.goal;
    savingsGoal.targetAmount =
      targetAmount !== undefined ? targetAmount : savingsGoal.targetAmount;
    savingsGoal.currentAmount =
      currentAmount !== undefined ? currentAmount : savingsGoal.currentAmount;
    savingsGoal.targetDate = targetDate || savingsGoal.targetDate;
    savingsGoal.interestRate =
      interestRate !== undefined ? interestRate : savingsGoal.interestRate;
    savingsGoal.frequency = frequency || savingsGoal.frequency;

    const updatedSavingsGoal = await savingsGoal.save();
    res.json(updatedSavingsGoal);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete a savings goal
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const savingsGoal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!savingsGoal) {
      return res.status(404).json({ msg: "Savings goal not found" });
    }

    res.json({ msg: "Savings goal deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
