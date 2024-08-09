const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


const router = express.Router();


router.post("/register", async(req,res)=>{
    const {username,email,password} = req.body;
    try{
        let user = await User.findOne({email});
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({
            username,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await user.save();

        const payload = {
            user:{
                id:user.id,
            },
        };

        jwt.sign(payload,"your jwt key",
            {expiresIn:'1h'},
            (err,token)=>{
                if(err){
                    throw err;
                };
                res.json({token});
            }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})


router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;