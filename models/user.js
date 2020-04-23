const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");



const UserSchema= new mongoose.Schema({
    username:{type:String,unique:true},
    password:String,
    name:String,
    phone:String,
    address:String,
    email:{type:String,unique:true},
    plan:String,
    isConUser:{type:Boolean,default:false},
    isFB:{},
    profilepic:{},
    data:{
        total:String,
        used:{}
    },
    rental:{
        total:Number,
        due:Number
    },
    lat:{},
    lng:{},
    resetPasswordToken: String,
    resetPasswordExpires: Date
})


UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);