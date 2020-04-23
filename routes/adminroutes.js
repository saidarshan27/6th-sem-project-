require("dotenv").config();

const express = require("express");
      router  = express.Router();
	    NodeGeocoder= require("node-geocoder");
      moment       = require("moment-timezone");
      Support = require("../models/newsupport");
      User    = require("../models/user");
      NewCon  = require("../models/newconreq");
			NewRouter= require("../models/Nroutereq");
			middleware = require("../middleware/index");

	  var options = {
		provider: 'google',
		httpAdapter: 'https',
		apiKey: process.env.GEOCODER_API_KEY,
		formatter: null
	  };
	   
	  var geocoder = NodeGeocoder(options);

//==========================
//ADMIN ROUTES
//==========================

//dashboard getting all counts
router.get("/admin",function(req,res){
	Support.countDocuments({},function(err,supportcount){
		if(err){
			console.log(err);
		}else{
			NewCon.countDocuments({},function(err,concount){
				if(err){
					console.log(err);
				}else{
					User.find().where("isConUser").equals("true").exec(function(err,allusers){
						const userscount=allusers.length;
						res.render("admin/admin",{supportcount:supportcount,concount:concount,userscount:userscount});
					})
				}
			})
		}
	})
})

//new connection adminside show 
router.get("/admin/request/new-connection/:id",function(req,res){
	NewCon.findById(req.params.id,function(err,foundnewcon){
		if(err){
			console.log(err);
		}else{
			res.render("admin/newconreqshow",{newcon:foundnewcon});
		}
	})
})
//index for newcon reqs
router.get("/admin/request/new-connection",function(req,res){
	NewCon.find({},function(err,newcons){
		if(err){
			console.log(err);
		}else{
			res.render("admin/adminnewcon",{newcons:newcons})
		}
	})
})

//router admin(still pending)
router.get("/admin/request/new-router",function(req,res){
	res.send("Routers admin");
})

//index for support tickets (admin)
router.get("/admin/support",function(req,res){
	Support.find({},function(err,allsupport){
		if(err){
			console.log(err);
		}else{
			res.render("admin/adminsupport",{allsupport:allsupport});
		}
	})
})
//posting support to admin
router.post("/admin/support",function(req,res){
	console.log(req.body);
	const data={
		type:req.body.type,
		comment:req.body.comment,
		status:"Pending",
		date:moment().format(),
		author: {
			id:req.user._id,
			name:req.user.name
		}
	}
	Support.create(data,function(err,newsupport){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	})
})

//show page for tickets admin
router.get("/admin/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.render("admin/ticketshow",{ticket:ticket});
		}
	})
})

//update route for ticket status
router.put("/admin/support/:id",function(req,res){
	Support.findByIdAndUpdate(req.params.id,{status:"Solved"},function(err,updatedticket){
		if(err){
			console.log(err);
		}else{
			res.redirect("/admin/support");
		}
	})
})




//posting router req to admin
router.post("/admin/request/new-router",middleware.isLoggedIn,function(req,res){
	const data={
		routername:req.body.routername,
		price:req.body.price
	}
	NewRouter.create(data,function(err,newrouter){
		if(err){
			console.log(err);
		}else{
			console.log(newrouter);
			res.redirect("/home");
		}
	})
})


//post route for approving new connection
router.post("/admin/request/new-connection",middleware.isLoggedIn,function(req,res){ 

var name=req.body.name;
var phone=req.body.phone;
var plan=req.body.plan;
var address=req.body.address;
var email=req.body.email;
var locality=req.body.locality;
var geoadress=address+","+locality;
var date=moment().format();

geocoder.geocode(geoadress,function(err,data){
	if(err){
		console.log(err);
	}else{
		const lat=data[0].latitude;
		const lng=data[0].longitude;
		const newcondata={
			name:name,
			phone:phone,
			address:address,
			plan:plan,
			email:email,
			locality:locality,
			lat:lat,
			lng:lng,
			author:{
				id:req.user._id,
				name:req.user.name
			},
			date:date
		}
	NewCon.create(newcondata,function(err,newcon){
		if(err){
			console.log(err);
		}else{
			console.log(newcon);
			res.redirect("/home");
		}
	})
	}
})
})




module.exports=router;