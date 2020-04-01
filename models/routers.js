const mongoose=require("mongoose");

const routerSchema= new mongoose.Schema({
    name:String,
    price:String,
    image:String
});

module.exports = mongoose.model('Router', routerSchema);