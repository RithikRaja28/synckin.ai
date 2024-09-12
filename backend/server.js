  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  require("dotenv").config();
  const auth = require("./routes/auth");
  const inventory = require("./routes/inventory");
  const tasks = require("./routes/tasks");
  const savings = require("./routes/savings");
  const income = require("./routes/income");
  const expense = require("./routes/expense");
  const budget = require("./routes/budget");
  const debt = require("./routes/debt");
  const family = require("./routes/family");

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
  app.use("/api/inventory", inventory);
  app.use("/api/tasks", tasks);
  app.use("/api/savings", savings);
  app.use("/api/income", income);
  app.use("/api/expense", expense);
  app.use("/api/budget", budget);
  app.use("/api/debt", debt);
  app.use("/api/family", family);