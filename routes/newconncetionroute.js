const express  = require("express"),
			router   = express.Router(),
			middleware = require("../middleware/index");

//=================
//new connection route
//==================

//new connection from user side
router.get("/new-connection/new",middleware.isLoggedIn,function(req,res){
	res.render("newcon");
})



module.exports=router;