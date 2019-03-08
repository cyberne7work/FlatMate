const express = require("express");
const Expense = require("../models/expense");
const Flat = require("../models/flat");

const router  = express.Router();

router.post("/newexpense",async (req,res)=>{
    const newExp = new Expense();
    const { expname,expamount,expby,expdate}=req.body;
    newExp.flatid=req.user._id,
    newExp.expname=expname,
    newExp.expamount=expamount,
    newExp.expby=expby,
    newExp.expdate=expdate
    const expense = await newExp.save();
    if(!expense){
        return res.send("Cant post new expense")
    }else{
        const foundFlat = await Flat.findOne({flatid:req.user._id});
        foundFlat.expense.push(expense);
        const result = await foundFlat.save();
        req.flash("sucess","Expense Added...")
        return res.redirect("/");
    }
    res.redirect("/");    
});

router.get("/expense/:id",async (req,res)=>{
    const foundExp  = await Expense.findById(req.params.id);
    res.render("editexpense",{exp:foundExp});
})
router.put("/expense/:id",async (req,res)=>{    
    const foundExp  = await Expense.findByIdAndUpdate(req.params.id,{$set:req.body.newexp});
    req.flash("sucess","Updated Succesfully...");
    res.redirect("/");
})
router.delete("/expense/:id",async (req,res)=>{
    const foundExp  = await Expense.findByIdAndDelete(req.params.id);
    req.flash("Deleted..")
    res.redirect("/user/expense");
})




module.exports=router;