const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const debtSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  dueDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastUpdatedDate: { type: Date, default: Date.now },
  minimumPayment: { type: Number, default: 0 },
});

module.exports = mongoose.model("Debt", debtSchema);
