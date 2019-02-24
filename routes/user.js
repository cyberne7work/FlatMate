const express = require("express");
const User = require("../models/user");
const router  = express.Router();

router.get("/newuser",async (req,res)=>{
    res.render("usersignup");
})

router.post("/newuser",async (req,res)=>{
    const { username,usersalary}=req.body;
    const newUser = new User({username,usersalary});
    const user = await User.create(newUser);
    if(!user){
        return res.send("Can't Create new User")
    }
    res.redirect("/");    
});


module.exports=router;