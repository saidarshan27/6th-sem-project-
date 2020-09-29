const mongoose=require("mongoose");

const routerSchema= new mongoose.Schema({
    name:String,
    price:Number,
    image:String
});

const Router =  mongoose.model('Router', routerSchema);

module.exports = Router;