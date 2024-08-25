const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Debt = require("../models/Debt");

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

// Calculate interest
const calculateInterest = (amount, interestRate) => {
  return amount + amount * (interestRate / 100);
};

// Create a new debt
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { name, amount, interestRate = 0, dueDate, minimumPayment } = req.body;

  try {
    const newDebt = new Debt({
      name,
      amount,
      interestRate,
      dueDate,
      userId,
      minimumPayment,
    });

    // Automatically calculate the updated amount based on the interest rate
    newDebt.amount = calculateInterest(newDebt.amount, newDebt.interestRate);

    const savedDebt = await newDebt.save();
    res.json(savedDebt);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get all debts for a user
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const debts = await Debt.find({ userId });
    res.json(debts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Update a debt
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { name, amount, interestRate, dueDate, minimumPayment } = req.body;

  try {
    let debt = await Debt.findOne({ _id: req.params.id, userId });
    if (!debt) {
      return res.status(404).json({ msg: "Debt not found" });
    }

    // Update the debt details
    debt.name = name || debt.name;
    debt.amount = amount !== undefined ? amount : debt.amount;
    debt.interestRate =
      interestRate !== undefined ? interestRate : debt.interestRate;
    debt.dueDate = dueDate || debt.dueDate;
    debt.minimumPayment = minimumPayment || debt.minimumPayment;

    // Recalculate the amount based on the new interest rate
    debt.amount = calculateInterest(debt.amount, debt.interestRate);

    debt.lastUpdatedDate = Date.now();

    const updatedDebt = await debt.save();
    res.json(updatedDebt);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete a debt
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const debt = await Debt.findOneAndDelete({ _id: req.params.id, userId });

    if (!debt) {
      return res.status(404).json({ msg: "Debt not found" });
    }

    res.json({ msg: "Debt deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
