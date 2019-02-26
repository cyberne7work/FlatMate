const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    usersalary:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model("users",UserSchema);