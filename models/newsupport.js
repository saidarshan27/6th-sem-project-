const mongoose=require("mongoose");

const supportSchema=new mongoose.Schema({
    type:String,
    comment:String
})

module.exports=mongoose.model("Support",supportSchema);