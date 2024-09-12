const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['Parent','Children'],
        required:true,
    },
    familyId:{
        type: mongoose.Schema.ObjectId,
        ref: "Family",
    },
    date:{
        type:Date,
        default:Date.now
    },
});

const User = mongoose.model('User',UserSchema);
module.exports = User;