const mongoose=require("mongoose");

const routerSchema= new mongoose.Schema({
    name:String,
    price:Number,
    image:String
});

module.exports = mongoose.model('Router', routerSchema);