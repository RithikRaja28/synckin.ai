const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateReceived: { type: Date, default: Date.now },
  category: { type: String }, // e.g., salary, freelance
});

module.exports = mongoose.model("Income", incomeSchema);
