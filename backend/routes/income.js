const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Income = require("../models/Income");

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

// Create a new income
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { source, amount, category } = req.body;

  try {
    const newIncome = new Income({
      source,
      amount,
      userId,
      category,
    });

    const savedIncome = await newIncome.save();
    res.json(savedIncome);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get all incomes for a user
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const incomes = await Income.find({ userId });
    res.json(incomes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Update an income
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { source, amount, category } = req.body;

  try {
    let income = await Income.findOne({ _id: req.params.id, userId });
    if (!income) {
      return res.status(404).json({ msg: "Income not found" });
    }

    income.source = source || income.source;
    income.amount = amount !== undefined ? amount : income.amount;
    income.category = category || income.category;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete an income
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!income) {
      return res.status(404).json({ msg: "Income not found" });
    }

    res.json({ msg: "Income deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
