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
        req.flash("error","Password must be Same");
        return res.redirect("/user/signup")
    }    
    const foundUser = await User.findOne({'local.email':req.body.email});
    if(foundUser){
        req.flash("error","Email already Exits")
        return res.redirect("/user/signup")
    }
    const newUser = new User();
        newUser.local.email=req.body.email,
        newUser.local.password=newUser.generateHash(req.body.password);
    if(!newUser){
        req.flash("error","New Account Can't Be Created");
        return console.log("User cant be Created");
    }
    const result    =await newUser.save();
    passport.authenticate("local")(req, res, async function(){
        const newFlat = new Flat();
        newFlat.flatid=req.user._id;
        const result= await newFlat.save();
        console.log(result);
        req.flash("sucess","Account Created Succesfully");
        res.redirect("/home"); 
     });
});

router.post("/login",passport.authenticate('local',{
    successRedirect:"/home",
    failureRedirect:"/"
}));

router.post("/logout",(req,res)=>{
    // req.session.destroy(err=>{
    //     if(err){
    //         return res.redirect("/home")
    //     }
    //     res.clearCookie();
        req.logout();
        req.flash("error","Logged Out");
        res.redirect("/login");
    // })
})



module.exports=router;