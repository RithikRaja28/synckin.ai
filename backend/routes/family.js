const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Family = require("../models/Family");
const nodemailer = require("nodemailer");
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rohitvijayandrive@gmail.com",
    pass: "kfzxznsmouxvszel",
  },
});

router.get("/show", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Find the user and their associated family
    const user = await User.findById(userId).populate("familyId");
    if (!user || !user.familyId) {
      return res.status(404).json({ msg: "User or family not found" });
    }

    // Find the family and populate members' details
    const family = await Family.findById(user.familyId).populate(
      "members.userId",
      "username role"
    );
    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    // Return family details if the user is part of the family
    res.json(family);
  } catch (err) {
    console.error("Error in /family route:", err.message);
    res.status(500).send("Server Error");
  }
});

// Add this route to search users
router.get("/search", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Add debugging logs
    console.log("Search query:", query);

    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive search
      // Adjust based on your schema
    }).limit(10);

    console.log("Users found:", users); // Check if users are found
    res.json(users);
  } catch (err) {
    console.error("Error searching users:", err.message);
    res.status(500).send("Server Error");
  }
});


router.post("/create", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "Parent") {
      return res.status(403).json({ msg: "Only parents can create a family." });
    }

    if (user.familyId) {
      return res.status(400).json({ msg: "User already has a family." });
    }

    // Ensure the familyName is provided in the request body
    const { familyName } = req.body;
    if (!familyName) {
      return res.status(400).json({ msg: "Family name is required." });
    }

    const family = new Family({
      parentId: user._id, // This is the required parentId field
      familyName: familyName, // This is the required familyName field
    });

    await family.save();

    // Update the user's familyId to the newly created family
    user.familyId = family._id;
    await user.save();

    res.json(family);
  } catch (err) {
    console.error("Error in /create route:", err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/add-member", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { username, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (user.role !== "Parent") {
      return res
        .status(403)
        .json({ msg: "Only parents can add family members." });
    }

    const member = await User.findOne({ username });

    if (!member) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (member.familyId) {
      return res.status(400).json({ msg: "User is already in a family." });
    }

    const inviteToken = jwt.sign(
      { memberId: member._id, familyId: user.familyId, role },
      "yourJWTSecret",
      { expiresIn: "1d" }
    );

    const mailOptions = {
      from: "rohitvijayandrive@gmail.com",
      to: member.email,
      subject: "Family Invitation",
      html: `
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7f9fc;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .header {
          background: #0056b3;
          color: #ffffff;
          padding: 20px;
          border-radius: 12px 12px 0 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          margin: 20px 0;
          font-size: 16px;
          line-height: 1.6;
          color: #333333;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 30px;
          text-transform: uppercase;
          margin: 20px 0;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #999999;
        }
        .btn-text {
          font-weight: 600;
          text-decoration: none;
          color: #ffffff;
          transition: color 0.3s ease;
        }
        
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">You're Invited!</div>
        <div class="content">
          <p>Hello,</p>
          <p>You've been invited to join a family on our platform. Click the button below to accept the invitation and get started:</p>
          <a href="http://localhost:5000/api/family/accept-invitation?token=${inviteToken}" class="button"><span class="btn-text">Accept Invitation</span></a>
          <p>If you have any questions, please contact us at support@yourplatform.com.</p>
          <p>Best regards,<br>SyncKin</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,
    };



    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ msg: "Error sending invitation email" });
      }
      console.log("Email sent: " + info.response);
      res.json({
        msg: "Invitation sent successfully. Please ask the member to check their email.",
      });
    });
  } catch (err) {
    console.error("Error in /add-member route:", err.message);
    res.status(500).send("Server error");
  }
});


router.get("/accept-invitation", async (req, res) => {
  const { token } = req.query; // Get token from query parameters

  try {
    // Verify the token
    const decoded = jwt.verify(token, "yourJWTSecret");
    const { memberId, familyId, role } = decoded;

    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (member.familyId) {
      return res.status(400).json({ msg: "User is already in a family." });
    }

    // Add the member to the family
    member.familyId = familyId;
    member.role = role;
    await member.save();

    const family = await Family.findById(familyId);
    family.members.push({ userId: member._id, role });
    await family.save();

    res.json({ msg: "Invitation accepted, and member added to the family." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Error accepting invitation." });
  }
});



router.delete("/delete", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the user is the parent of the family
    const family = await Family.findById(user.familyId);
    if (!family) {
      return res.status(404).json({ msg: "Family not found" });
    }

    if (family.parentId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Only the parent can delete the family." });
    }

    // If user is the parent, delete the family
    await Family.findByIdAndDelete(family._id);

    // Remove the family ID from all family members
    await User.updateMany(
      { familyId: family._id },
      { $unset: { familyId: 1 } }
    );

    res.json({ msg: "Family deleted successfully" });
  } catch (err) {
    console.error("Error deleting family:", err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/remove-member", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const { _id } = req.body;

  try {
    if (!_id) {
      return res.status(400).json({ msg: "Member ID (_id) is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    if (user.role !== "Parent") {
      return res
        .status(403)
        .json({ msg: "Only parents can remove family members." });
    }

    const family = await Family.findById(user.familyId);
    if (!family) {
      return res.status(404).json({ msg: "Family not found." });
    }

    // Check if the member with the given _id is part of the family
    const member = family.members.find((m) => m.userId.toString() === _id);
    if (!member) {
      return res.status(404).json({ msg: "Member not found in the family." });
    }

    // Remove member from Family members array
    family.members = family.members.filter(
      (m) => m.userId.toString() !== _id.toString()
    );
    await family.save();

    // Remove familyId from the member
    const memberUser = await User.findById(_id);
    if (memberUser) {
      memberUser.familyId = null;
      await memberUser.save();
    }

    res.json({ msg: "Member removed successfully" });
  } catch (err) {
    console.error("Error removing member:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
