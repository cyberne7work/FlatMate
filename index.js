const express = require("express");
const mongoose  = require("mongoose");
const bodyparser    =require("body-parser");
const methodOverride    = require("method-override");
const Expense     =require("./models/expense");
const User     =require("./models/user");
const expenseRouter    =require("./routes/expenseRoute");
const userRouter    =require("./routes/user");
const index   =express();
const db="vishal:cyberne7work@ds117469.mlab.com:17469/flatmate";
mongoose.connect("mongodb://vishal:cyberne7work@ds117469.mlab.com:17469/flatmate",{ useNewUrlParser: true })
    .then(()=>{console.log("Connected to Database")})
    .catch((err)=>{console.log(err.message)});


// Middileware Handling

index.set("view engine","ejs");
index.use(express.static("public"));
index.use(bodyparser.urlencoded({extended:true}));
index.use(methodOverride("_method"));
index.use("/user",expenseRouter);
index.use("/user",userRouter);



// Routes
index.get("/",async (req,res)=>{
    let a = 0;
    const expense =await Expense.find({});
    const amount = expense.forEach(exp=>{
         a=a+ exp.expamount;
    })
    const user = await User.find({});
    console.log(user.length)
    res.render("home",{expense:expense,total:a,user:user});
});





const port = process.env.PORT || 3000;

// Listing Server
index.listen(port,(err,done)=>{
    if(err) return console.log(err);
    console.log("Server is Started");
});