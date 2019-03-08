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
        return res.send("/")
    }else{
        const flat = await Flat.findOne({flatid:req.user._id});
        flat.mates.push(mate);
        await flat.save();
        req.flash("sucess","New Mate Added");
        return res.redirect("/");  
    }
      
});

router.get("/info",async (req,res)=>{
    const mate = await Mate.find({mateid:req.user._id});
    res.render("mateinfo",{mate:mate});
});

router.post("/expense",async (req,res)=>{
    const mate = await Mate.findOne( { $and: [ { mateid: req.user._id}, { matename:req.body.selecteduser  } ] } )
    const expdetail = await Expense.find( { $and: [ { flatid: req.user._id}, { expby:req.body.selecteduser  } ] } );
    let amount=0;
        expdetail.forEach(ele=>{
            amount = amount + ele.expamount;
        });
        let allexp=[];
        for (let index = expdetail.length-1; index >=0;  index--) {  
            allexp.push(expdetail[index]);
        }
    res.render("myexpense",{expdetail:allexp,Mate:mate,totalamount:amount});
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
    req.flash("sucess","Updated..")
    res.redirect("/mate/info");
});



// Delete Route
router.delete("/:id",async (req,res)=>{
    const mate = await Mate.findByIdAndDelete(req.params.id);
    if(!mate){
        return res.send("Mate Not Found")
    }
    req.flash("sucess","Deleted");
    res.redirect("/mate/info");
});

module.exports=router;