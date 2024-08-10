const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const auth = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => console.log("Error in connecting DB", e));


app.get("/",(req,res)=>{
    res.send("Welcome to Synckin.ai");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("Successfully connected to ", PORT));


app.use("/auth",auth);
