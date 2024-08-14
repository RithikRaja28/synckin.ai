    const express = require("express");
    const router = express.Router();
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const { check, validationResult } = require("express-validator");
    const authmiddleware = require("../middleware/authmiddleware")


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
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log("Validation errors:", errors.array()); // Log validation errors
          return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
          console.log("Checking for existing user with email:", email); // Log for debugging
          let user = await User.findOne({ email });
          if (user) {
            console.log("User already exists"); // Log for debugging
            return res.status(400).json({ msg: "User already exists" });
          }

          user = new User({ username, email, password });

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
            { expiresIn: 360000 },
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


    module.exports = router;
