const express = require("express");
const Expense = require("../models/expense");
const router  = express.Router();

router.post("/newexpense",async (req,res)=>{
    const newExp = new Expense();
    const { expname,expamount,expby}=req.body;
    newExp.flatid=req.user._id,
    newExp.expname=expname,
    newExp.expamount=expamount,
    newExp.expby=expby
    
    const expense = await newExp.save();
    if(!expense){
        return res.send("Cant post new expense")
    }
    res.redirect("/");    
});

router.get("/expense/:id",async (req,res)=>{
    const foundExp  = await Expense.findById(req.params.id);
    res.render("editexpense",{exp:foundExp});
})
router.put("/expense/:id",async (req,res)=>{
    console.log(req.body.newexp);
    
    const foundExp  = await Expense.findByIdAndUpdate(req.params.id,{$set:req.body.newexp});
    res.redirect("/");
})
router.delete("/expense/:id",async (req,res)=>{
    
    const foundExp  = await Expense.findByIdAndDelete(req.params.id);
    res.redirect("/");
})




module.exports=router;