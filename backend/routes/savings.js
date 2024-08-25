const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SavingsGoal = require("../models/SavingsGoal");

// Function to verify the JWT token and extract the user ID
const verifyToken = (req) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, "yourJWTSecret");
    return decoded.user.id;
  } catch (err) {
    return null;
  }
};

// Function to calculate the updated amount based on interest rate and frequency
const calculateUpdatedAmount = (goal) => {
  const { currentAmount, interestRate, frequency, lastUpdatedDate } = goal;
  const now = new Date();
  let updatedAmount = currentAmount;
  const monthsPassed =
    (now.getFullYear() - lastUpdatedDate.getFullYear()) * 12 +
    (now.getMonth() - lastUpdatedDate.getMonth());

  if (frequency === "Monthly" && monthsPassed > 0) {
    // Monthly compounding
    updatedAmount =
      currentAmount * Math.pow(1 + interestRate / 100 / 12, monthsPassed);
  } else if (frequency === "Annually" && monthsPassed >= 12) {
    // Annual compounding
    const yearsPassed = Math.floor(monthsPassed / 12);
    updatedAmount =
      currentAmount * Math.pow(1 + interestRate / 100, yearsPassed);
  }

  return updatedAmount;
};

// Route to create a new savings goal
router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { goal, targetAmount, targetDate, interestRate, frequency } = req.body;

  try {
    const newGoal = new SavingsGoal({
      goal,
      targetAmount,
      currentAmount,
      userId,
      interestRate,
      frequency,
      targetDate,
    });

    const savedGoal = await newGoal.save();
    res.json(savedGoal);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Route to show all savings goals for the user, with updated amounts
router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const goals = await SavingsGoal.find({ userId });
    const updatedGoals = goals.map((goal) => {
      const updatedAmount = calculateUpdatedAmount(goal);
      return {
        ...goal._doc,
        currentAmount: updatedAmount,
      };
    });

    res.json(updatedGoals);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Route to update a specific savings goal
router.put("/update/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const {
    goal,
    targetAmount,
    currentAmount,
    interestRate,
    frequency,
    targetDate,
  } = req.body;

  try {
    const goalToUpdate = await SavingsGoal.findOne({
      _id: req.params.id,
      userId,
    });

    if (!goalToUpdate) {
      return res.status(404).json({ msg: "Savings goal not found" });
    }

    // Update the savings goal fields
    goalToUpdate.goal = goal || goalToUpdate.goal;
    goalToUpdate.targetAmount = targetAmount || goalToUpdate.targetAmount;
    goalToUpdate.currentAmount = currentAmount || goalToUpdate.currentAmount;
    goalToUpdate.interestRate = interestRate || goalToUpdate.interestRate;
    goalToUpdate.frequency = frequency || goalToUpdate.frequency;
    goalToUpdate.targetDate = targetDate || goalToUpdate.targetDate;
    goalToUpdate.lastUpdatedDate = new Date();

    // Calculate the updated amount before saving
    goalToUpdate.currentAmount = calculateUpdatedAmount(goalToUpdate);

    const updatedGoal = await goalToUpdate.save();
    res.json(updatedGoal);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Route to delete a specific savings goal
router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!goal) {
      return res.status(404).json({ msg: "Savings goal not found" });
    }

    res.json({ msg: "Savings goal deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
