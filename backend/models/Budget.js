const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastUpdatedDate: { type: Date, default: Date.now },
  period: { type: String, enum: ["Monthly", "annually"], default: "Monthly" }, // e.g., monthly, annually
});

module.exports = mongoose.model("Budget", budgetSchema);
