const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingsGoalSchema = new Schema({
  goal: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  targetDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  interestRate: { type: Number, default: 0 },
  lastUpdatedDate: { type: Date, default: Date.now },
  frequency: {
    type: String,
    enum: ["Monthly", "Annually"],
    default: "Annually",
  },
});

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
