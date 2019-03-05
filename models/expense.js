const mongoose = require("mongoose");

const ExpenceSchema = new mongoose.Schema({
    flatid:{
        type:mongoose.Types.ObjectId,
        ref:'flat'
    },
    expname:{
        type:String,
        required:true,
    },
    expamount:{
        type:Number,
        required:true
    },
    expby:{
        type:String,
        required:true
    },
    expdate:{
        type:String,
        require:true,
        default:Date.now(),
    }
})

module.exports=mongoose.model("expense",ExpenceSchema);