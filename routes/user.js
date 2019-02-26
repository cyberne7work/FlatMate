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

router.get("/expense",async (req,res)=>{
    const user = await User.find();
    if(user.length===0){
        return console.log("No user Found");
    }
    console.log(user);
    res.render("myexpense",{user:user});
});

router.post("/expense",async (req,res)=>{
    const {selecteduser}=req.body;
    const expdetail = await User.find({username:selecteduser});
    res.redirect("/user/myexpense");
})

module.exports=router;