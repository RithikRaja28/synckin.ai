const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const authmiddleware = require("../middleware/authmiddleware");

const User = require("../models/User"); // Assuming the User model is in the models folder

// Register a new user
router.post(
  "/register",
  [
    check("username", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Role is required").not().isEmpty(), // Validate role
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body; // Include role

    try {
      console.log("Checking for existing user with email:", email); // Log for debugging
      let user = await User.findOne({ email });
      if (user) {
        console.log("User already exists"); // Log for debugging
        return res.status(400).json({ msg: "User already exists" });
      }

      // Include role when creating the new user
      user = new User({ username, email, password, role });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log("User registered successfully"); // Log for debugging

      const payload = {
        user: { id: user.id },
      };

      jwt.sign(
        payload,
        "yourJWTSecret",
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login a user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      if (user.subscription.endDate && new Date() > user.subscription.endDate) {
        user.subscription.status = false; // Deactivate subscription if expired
        await user.save();
      }


      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "yourJWTSecret", // Replace with your secret key
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/user", authmiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user details:", err.message);
    res.status(500).send("Server error");
  }
});

// Update user profile
router.put("/profile", authmiddleware, async (req, res) => {
  const { username, email, role } = req.body;

  // Validation
  if (!username || !email || !role) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the email is being updated and if it's already taken by another user
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: "Email already in use" });
      }
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).send("Server error");
  }
});

// Change user password
router.put(
  "/change-password",
  authmiddleware,
  [
    check("currentPassword", "Current password is required").exists(),
    check(
      "newPassword",
      "Please enter a new password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Check if the current password matches the user's password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Hash the new password and update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      res.json({ msg: "Password updated successfully" });
    } catch (err) {
      console.error("Error updating password:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// Subscribe a user
router.post("/subscribe", authmiddleware, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Calculate subscription end date (e.g., 1 month from now)
        const currentDate = new Date();
        const oneMonthLater = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

        // Update user subscription details
        user.subscription.status = true;
        user.subscription.startDate = new Date();
        user.subscription.endDate = oneMonthLater;

        await user.save();

        res.json({ msg: "Subscription activated successfully", subscription: user.subscription });
    } catch (err) {
        console.error("Error subscribing user:", err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
