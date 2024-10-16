const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const FamilySavings = require("../../models/Family Model/FamilySavings");

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

router.post("/savings", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { goal, amount, targetDate,assignedTo, familyId } = req.body;

  console.log(`Adding savings for family ${familyId}`);

  try {
    const savings = new FamilySavings({
      goal,
      amount,
      targetDate,
      contributedBy: userId,
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
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { assignedTo } = req.params;

  console.log(`Fetching savings assigned to ${assignedTo}`);

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
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
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
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
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