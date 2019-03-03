const express   = require("express");
const passport  =require("passport");
const redirectHome  = require("../middleware/redirectHome");
const User  = require("../models/user");
const Flat  = require("../models/flat");

const router   =express.Router();

router.get("/signup",redirectHome,async (req,res)=>{
    res.render("register");
})

router.post("/signup",async (req,res)=>{

    if(req.body.password !== req.body.cnfrmpassword){
        return res.send("Password and Confirm  Password  Does't Match")
    }
    console.log(req.body);
    
    const foundUser = await User.findOne({'local.email':req.body.email});
    if(foundUser){
        return res.send("Email Already Found");
    }
    const newUser = new User();
        newUser.local.email=req.body.email,
        newUser.local.password=newUser.generateHash(req.body.password);
        console.log("pass"); 
    if(!newUser){
        return console.log("User cant be Created");
    }
    const result    =await newUser.save();
    passport.authenticate("local")(req, res, async function(){
        const newFlat = new Flat();
        newFlat.flatid=req.user._id;
        const result= await newFlat.save();
        console.log(result);
        res.redirect("/home"); 
     });
});

router.post("/login",passport.authenticate('local',{
    successRedirect:"/home",
    failureRedirect:"/fail"
}));

router.post("/logout",(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect("/home")
        }
        res.clearCookie();
        res.redirect("/");
    })
})



module.exports=router;