const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const InventoryItem = require("../models/InventoryItem");

const verifyToken = (req) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return null;
    console.log("No token");
  }
  try {
    const decoded = jwt.verify(token, "yourJWTSecret");
    return decoded.user.id;
  } catch (err) {
    return null;
    console.log(err);
  }
};

router.post("/add", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    res.status(401).send("Unauthorized");
    console.log("Invalid token");
  }

  const { name, quantity, description, dueDate } = req.body;
  try {
    const newItem = new InventoryItem({
      name,
      quantity,
      description,
      dueDate,
      userId,
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    res.status(401).send("Unauthorized");
    console.log("Invalid token");
  }
  try {
    const items = await InventoryItem.find({ userId });
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});


router.put('/update/:id', async (req, res) => {
    const userId = verifyToken(req);
    if (!userId) {
        return res.status(401).json({ msg: 'No token or invalid token, authorization denied' });
    }

    const { name, quantity, description, dueDate } = req.body;

    try {
        const item = await InventoryItem.findOneAndUpdate(
            { _id: req.params.id, userId },
            { $set: { name, quantity, description, dueDate } },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.delete("/delete/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res
      .status(401)
      .json({ msg: "No token or invalid token, authorization denied" });
  }

  try {
    const item = await InventoryItem.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }

    res.json({ msg: "Item deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;