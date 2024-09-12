const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  familyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Family",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  role: { type: String, enum: ["Parent", "Child"], required: true },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Invitation", invitationSchema);
