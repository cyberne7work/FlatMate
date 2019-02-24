const express = require("express");
const Expense = require("../models/expense");
const router  = express.Router();

router.post("/newexpense",async (req,res)=>{

    const { expname,expamount,expby}=req.body;
    const newExp = new Expense({expname,expamount,expby});
    const expense = await Expense.create(newExp);
    if(!expense){
        return res.send("Cant post new expense")
    }
    res.redirect("/");    
});


module.exports=router;