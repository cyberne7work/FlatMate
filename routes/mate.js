const express = require("express");
const Mate = require("../models/mate");
const Flat = require("../models/flat");
const Expense = require("../models/expense");
const router  = express.Router();

router.get("/newMate",async (req,res)=>{
    res.render("matesignup");
})

router.post("/newMate",async (req,res)=>{
    const { matename,matesalary,matemobile,matejob}=req.body;
    const newMate = new Mate();
        newMate.mateid=req.user._id,
        newMate.matename=matename,
        newMate.matesalary=matesalary,
        newMate.matemobile=matemobile,
        newMate.matejob=matejob
    const mate = await newMate.save();
    
    if(!mate){
        return res.send("Can't Create new Mate")
    }else{
        const flat = await Flat.findOne({flatid:req.user._id});
        flat.mates.push(mate);
        await flat.save();
        return res.redirect("/");  
    }
      
});

router.get("/info",async (req,res)=>{
    const mate = await Mate.find({mateid:req.user._id});
    console.log(mate);
    res.render("mateinfo",{mate:mate});
});

router.post("/expense",async (req,res)=>{
    const mate = await Mate.findOne( { $and: [ { mateid: req.user._id}, { matename:req.body.selecteduser  } ] } )
    const expdetail = await Expense.find( { $and: [ { flatid: req.user._id}, { expby:req.body.selecteduser  } ] } );
    let amount=0;
        expdetail.forEach(ele=>{
            amount = amount + ele.expamount;
        });
        console.log("detail",mate)
    res.render("myexpense",{expdetail:expdetail,Mate:mate,totalamount:amount});
});

// Edit and Update Route

router.get("/:id",async (req,res)=>{
    const mate = await Mate.findById(req.params.id);
    if(!mate){
        return res.send("Mate Not Found")
    }
    res.render("updateMate",{mate:mate});
});
router.put("/:id",async (req,res)=>{
    const mate = await Mate.findByIdAndUpdate(req.params.id,{$set:req.body.Mate});
    if(!mate){
        return res.send("Mate Not Found")
    }
    res.redirect("/mate/info");
});



// Delete Route
router.delete("/:id",async (req,res)=>{
    const mate = await Mate.findByIdAndDelete(req.params.id);
    if(!mate){
        return res.send("Mate Not Found")
    }
    res.redirect("/mate/info");
});

module.exports=router;