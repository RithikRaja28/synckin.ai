const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  name: { type: String, required: true }, // Name of the budget
  amount: { type: Number, required: true }, // Total budget amount
  duration: { type: String, enum: ["monthly", "annually"], required: true }, // Duration of the budget
  startDate: { type: Date, required: true }, // Start date of the budget period
  endDate: { type: Date, required: true }, // End date of the budget period
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }], // Linked expenses
});

module.exports = mongoose.model("Budget", budgetSchema);
