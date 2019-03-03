const express = require("express");
const Flat = require("../models/flat");

const router  = express.Router();

router.get("/update",async(req,res)=>{
    const flat= await Flat.findOne({flatid:req.user._id});
    res.render("flatinfo",{flat:flat});
});

router.put("/:id",async (req,res)=>{
    const foundflat  = await Flat.findByIdAndUpdate(req.params.id,{$set:req.body.Flat});
    console.log(foundflat);
    res.redirect("/");
})

module.exports=router;