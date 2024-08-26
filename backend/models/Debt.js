const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const debtSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 0 },
  interestAmount: { type: Number, default: 0 }, // New field to store the calculated interest
  totalAmount: { type: Number, default: 0 }, // New field to store the total amount with interest
  isInterestApplicable: { type: Boolean, default: false }, // New field to check if interest is applicable
  dueDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lastUpdatedDate: { type: Date, default: Date.now },
  minimumPayment: { type: Number, default: 0 },
});

module.exports = mongoose.model("Debt", debtSchema);
