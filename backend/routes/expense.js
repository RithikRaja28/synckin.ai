const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

// Create a new expense
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { category, subcategory, amount, description } = req.body;

  try {
    const newExpense = new Expense({
      category,
      subcategory,
      amount,
      description,
      userId,
    });

    const savedExpense = await newExpense.save();
    res.json(savedExpense);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get all expenses for a user
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const expenses = await Expense.find({ userId });
    res.json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Update an expense
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { category, subcategory, amount, description } = req.body;

  try {
    let expense = await Expense.findOne({ _id: req.params.id, userId });
    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    expense.category = category || expense.category;
    expense.subcategory = subcategory || expense.subcategory;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.description = description || expense.description;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete an expense
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    res.json({ msg: "Expense deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
