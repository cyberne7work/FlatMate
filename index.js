const express = require("express");
const index   =express();


// Middileware Handling

index.set("view engine","ejs");
index.use(express.static("public"));


// Routes
index.get("/",(req,res)=>{
    res.render("home");
});





const port = process.env.PORT || 3000;

// Listing Server
index.listen(port,(err,done)=>{
    if(err) return console.log(err);
    console.log("Server is Started");
});