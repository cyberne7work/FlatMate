const express   = require("express");
const passport  =require("passport");
const redirectHome  = require("../middleware/redirectHome");
const randomstring        = require("randomstring");
const nodemailer           =require("nodemailer")
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
router.get("/forget",(req,res)=>{
    res.render("forget");
});
router.post("/forget",async (req,res)=>{
    
    const foundFlat = await User.findOne({"local.email":req.body.email});
    if(!foundFlat){
        req.flash("error","Email Not Found");
        return res.redirect("/user/forget");
    }
    const token = randomstring.generate(20);
    foundFlat.local.resetToken=token;
    foundFlat.local.resetPassExp=Date.now() + 3600000;
    const result= await foundFlat.save();
        let smtpTransport = nodemailer.createTransport( {
          service: 'SendGrid',
            auth:{
                user: 'apikey',
                pass: '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'
            }
          
        })
        let mailOptions = {
          to: foundFlat.local.email,
          from: 'justmailvishal58@gmail.com',
          subject: 'FlatMate Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/user/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        smtpTransport.sendMail(mailOptions, function(err) {
            if(err){
                req.flash("error","Server Error")
               return res.redirect("/user/forget");
            }
            req.flash('error', 'An e-mail has been sent to ' + foundFlat.local.email + ' with further instructions.');
            return res.redirect("/user/forget");
          });
        });

router.get("/reset/:token",async function(req,res){
    const found= await User.findOne({'local.resetToken':req.params.token,'local.resetPassExp':{$gt:Date.now()}});
        if(!found){
            req.flash("error","Something Went Wrong...Try Again");
            return res.redirect("/");
        }
    res.render("confirmPassword",{id:found._id});
});

router.post("/reset/:id",async function(req,res){
    console.log(req.body)
    if(req.body.password !== req.body.cnfrmpassword){
        req.flash("error","Both Password Must Be Same");
        return res.redirect("/");
    }
    const found= await User.findById(req.params.id);
        if(!found){
            req.flash("error","Something Went Wrong...Try Again");
            return res.redirect("/");
        }
        found.local.password=found.generateHash(req.body.password);
        found.local.resetToken=null;
        found.local.resetPassExp=null;
        const result= await found.save();
        if(!result){
            req.flash("error","Something Went Wrong");
            return res.redirect("/")
        }else{
            let smtpTransport = nodemailer.createTransport( {
                service: 'SendGrid',
                  auth:{
                      user: 'apikey',
                      pass: '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'
                  }
                
              })
              let mailOptions = {
                to: result.local.email,
                from: 'justmailvishal58@gmail.com',
                subject: 'Password Change Sucessully',
                text: 'Your FlatMate Account Password is Succesfully Changed.'
              }
              smtpTransport.sendMail(mailOptions, function(err,done) {
                  if(err){
                    req.flash("error","Server Error")
                     return res.redirect("/user/forget");
                  }else{
                    req.flash("sucess","Password Changed Sucessfully")
                    return res.redirect("/");
                  }
                });
        }
        req.flash('sucess', 'Password Changed sucessfully');
        res.redirect("/")
});


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