var mongoose = require("mongoose");

var supportSchema = mongoose.Schema({
    type: String,
    comment:String,
    date:String,
    status:String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Support", supportSchema);