const mongoose = require("mongoose");

const FlatSchema = new mongoose.Schema({
    flatid:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    flatname:{
        type:String,
    },
    flatquote:{
        type:String,
    },
    expense:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"expense"
    }],
    mates:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"mates"
    }],

})

module.exports=mongoose.model("flat",FlatSchema);