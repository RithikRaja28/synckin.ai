const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

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

// Create a new budget
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { name, amount, duration, startDate, endDate } = req.body;

  try {
    const newBudget = new Budget({
      name,
      amount,
      duration,
      startDate,
      endDate,
      userId,
      expenses: [],
    });

    const savedBudget = await newBudget.save();
    res.json(savedBudget);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get all budgets for a user
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const budgets = await Budget.find({ userId }).populate("expenses");
    res.json(budgets);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Update a budget
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { name, amount, duration, startDate, endDate } = req.body;

  try {
    let budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) {
      return res.status(404).json({ msg: "Budget not found" });
    }

    budget.name = name || budget.name;
    budget.amount = amount !== undefined ? amount : budget.amount;
    budget.duration = duration || budget.duration;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete a budget
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!budget) {
      return res.status(404).json({ msg: "Budget not found" });
    }

    res.json({ msg: "Budget deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get budget progress
router.get("/progress/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId,
    }).populate("expenses");
    if (!budget) {
      return res.status(404).json({ msg: "Budget not found" });
    }

    // Calculate total expenses within the budget period
    const totalExpenses = budget.expenses.reduce((total, expense) => {
      if (expense.date >= budget.startDate && expense.date <= budget.endDate) {
        return total + expense.amount;
      }
      return total;
    }, 0);

    const progress = (totalExpenses / budget.amount) * 100;

    res.json({ progress, totalExpenses, budgetAmount: budget.amount });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
