const mongoose=require("mongoose");

const supportSchema=new mongoose.Schema({
    type:String,
    comment:String,
    date:String,
    status:String
})

module.exports=mongoose.model("Support",supportSchema);