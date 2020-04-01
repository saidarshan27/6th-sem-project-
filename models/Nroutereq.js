const mongoose=require("mongoose");

const NrouterSchema= new mongoose.Schema({
    routername:String,
    price:String
});


module.exports=mongoose.model("NewRouter",NrouterSchema);