const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Budget = require("../models/Budget");

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

  const { category, limit, spent = 0, period = "Monthly" } = req.body;

  try {
    const newBudget = new Budget({
      category,
      limit,
      spent,
      userId,
      period,
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
    const budgets = await Budget.find({ userId });
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

  const { category, limit, spent, period } = req.body;

  try {
    let budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) {
      return res.status(404).json({ msg: "Budget not found" });
    }

    // Update the budget details
    budget.category = category || budget.category;
    budget.limit = limit !== undefined ? limit : budget.limit;
    budget.spent = spent !== undefined ? spent : budget.spent;
    budget.period = period || budget.period;

    budget.lastUpdatedDate = Date.now();

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

module.exports = router;
