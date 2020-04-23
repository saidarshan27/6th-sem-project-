const express = require("express");
      router  = express.Router();
			Support    = require("../models/newsupport");
			middleware = require("../middleware/index");


//============================
//SUPPORT routes
//============================

//user side viewing tickets
router.get("/support",function(req,res){
	Support.find().where("author.id").equals(req.user._id).exec(function(err,allsupport){
		if(err){
			console.log(err);
		}else{
			if(req.xhr){
				res.json(allsupport);
			}else{
				res.send("YOU CANT ACCESS IT LIKE THIS")
			}
		}
	})
	})

//creating new ticket userside
router.get("/support/new",middleware.isLoggedIn,function(req,res){
	res.render("support");
})

//show for userside ticket
router.get("/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.json(ticket);
		}
	})
})

router.put("/support/:id",function(req,res){
	const data=req.body;
	Support.findByIdAndUpdate(req.params.id,data,{new:true},function(err,updatedticket){
		if(err){
			console.log(err);
		}else{
			res.json(updatedticket);
		}
	})
})

//deleting tickets user side
router.delete("/support/:id",function(req,res){
	Support.findByIdAndRemove(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.json(ticket);
		}
	})
})



module.exports=router;