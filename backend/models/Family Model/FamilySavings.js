const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilySavingsSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  amount: { type: Number, required: true },
  targetDate: { type: Date },
  contributedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  familyId: {
    type: Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },
});
module.exports = mongoose.model("FamilySavings", FamilySavingsSchema);
