const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
  familyName: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      role:{
        type:String,
        enum:['Parent','Children'],
        required:true,
      },
    },
  ],
  createdAt:{
    type:Date,
    default:Date.now,
  }
});


module.exports = mongoose.model("Family", FamilySchema);