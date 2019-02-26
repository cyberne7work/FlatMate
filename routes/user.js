const express = require("express");
const User = require("../models/user");
const Expense = require("../models/expense");
const router  = express.Router();

router.get("/newuser",async (req,res)=>{
    res.render("usersignup");
})

router.post("/newuser",async (req,res)=>{
    const { username,usersalary,usermobile,userjob}=req.body;
    const newUser = new User({username,usersalary,usermobile,userjob});
    const user = await User.create(newUser);
    if(!user){
        return res.send("Can't Create new User")
    }
    res.redirect("/");    
});

router.get("/info",async (req,res)=>{
    const user = await User.find();
    console.log(user);
    res.render("usersinfo",{user:user});
});

router.post("/expense",async (req,res)=>{
    const user = await User.find({username:req.body.selecteduser});
    const expdetail = await Expense.find({expby:req.body.selecteduser});
    let amount=0;
        expdetail.forEach(ele=>{
            amount = amount + ele.expamount;
        });
    res.render("myexpense",{expdetail:expdetail,user:user,totalamount:amount});
});

// Edit and Update Route

router.get("/:id",async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.send("User Not Found")
    }
    res.render("updateuser",{user:user});
});
router.put("/:id",async (req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body.user});
    if(!user){
        return res.send("User Not Found")
    }
    res.redirect("/user/info");
});

router.delete("/:id",async (req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return res.send("User Not Found")
    }
    res.redirect("/user/info");
});

// Delete Route

module.exports=router;