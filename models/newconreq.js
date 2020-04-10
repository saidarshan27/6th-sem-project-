const mongoose=require("mongoose");

const newcSchema= new mongoose.Schema({
    name:String,
    phone:String,
    address:String,
    locality:String,
    lat:String,
    lng:String,
    email:String,
    plan:String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports=mongoose.model("NewCon",newcSchema);