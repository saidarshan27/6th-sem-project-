const mongoose=require("mongoose");

const newcSchema= new mongoose.Schema({
    name:String,
    phone:String,
    address:String,
    locality:String,
    lat:String,
    lng:String,
    email:String,
    plan:String
});

module.exports=mongoose.model("NewCon",newcSchema);