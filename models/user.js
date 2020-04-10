const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");


const UserSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    phone:String,
    address:String,
    email:String,
    plan:String,
    isConUser:{type:Boolean,default:false}
})


UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);