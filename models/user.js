const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Types.ObjectId,
        ref:'flat'
    },
    username:{
        type:String,
        required:true,
    },
    usersalary:{
        type:Number,
        required:true
    },
    usermobile:{
        type:Number,
        required:true
    },
    userjob:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model("users",UserSchema);