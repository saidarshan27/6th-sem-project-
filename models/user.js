const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");


const UserSchema= new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:String,
    name:String,
    phone:String,
    address:String,
    email:{type:String,unique:true,required:true},
    plan:String,
    isConUser:{type:Boolean,default:false},
    profilepic:{},
    data:{
        total:String,
        used:String
    },
    rental:{},
    lat:{},
    lng:{},
    resetPasswordToken: String,
    resetPasswordExpires: Date
})


UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);