const mongoose = require("mongoose");

const MateSchema = new mongoose.Schema({
    mateid:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    matename:{
        type:String,
        required:true,
    },
    matesalary:{
        type:Number,
        required:true
    },
    matemobile:{
        type:Number,
        required:true
    },
    matejob:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model("mates",MateSchema);