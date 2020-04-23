const mongoose =require("mongoose");

const paySchema= mongoose.Schema({
  payment_id:String,
  amount:Number,
  status:String,
  method:String,
  orderid:String,
  author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String
},
  purpose: String
})

module.exports=mongoose.model("Payment",paySchema);