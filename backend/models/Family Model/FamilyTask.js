const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilyTaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  familyId: { type: Schema.Types.ObjectId, ref: "Family", required: true },
});

module.exports = mongoose.model("FamilyTask", FamilyTaskSchema);
