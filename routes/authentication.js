const express   = require("express");
const passport  =require("passport");
const redirectHome  = require("../middleware/redirectHome");
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
    
    const foundFlat = await Flat.findOne({'local.email':req.body.email});
    if(foundFlat){
        return res.send("Email Already Found");
    }
    const newFlat = new Flat();
    newFlat.local.flatname=req.body.flatname,
        newFlat.local.email=req.body.email,
        newFlat.local.password=newFlat.generateHash(req.body.password);
        console.log("pass"); 
    if(!newFlat){
        return console.log("User cant be Created");
    }
    const result    =await newFlat.save();
    passport.authenticate("local")(req, res, function(){
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