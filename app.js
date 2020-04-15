require("dotenv").config();

const express = require('express');
const app = express();
const methodOverride=require("method-override");
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const passport =require("passport");
const LocalStrategy=require("passport-local");
const multer=require("multer");
const async=require("async");
const nodemailer=require("nodemailer");
const crypto=require("crypto")
var Plan=require("./models/plans");
const Router=require("./models/routers");
const NewCon=require("./models/newconreq");
const NewRouter=require("./models/Nroutereq");
const User=require("./models/user");
const Support=require("./models/newsupport");
const NodeGeocoder = require('node-geocoder');
const moment       = require("moment-timezone");

 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.locals.moment=moment;
moment.tz.setDefault("Asia/Kolkata");
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"CSGO is the best game",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
})

const mongoURI="mongodb+srv://saidarshan:R@mb02501@cluster0-wjhf4.mongodb.net/project?retryWrites=true&w=majority"

const promise=mongoose.connect(mongoURI, {
		useNewUrlParser: true ,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	},function(err){
		if(err){
			console.log(err);
		}else{
			console.log('Connected to DB');
		}
	})

	var storage = multer.diskStorage({
	  filename: function(req, file, callback) {
		callback(null,  Date.now() + file.originalname);
	  }
	});
	var imageFilter = function (req, file, cb) {
		// accept image files only
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	};
	var upload = multer({ storage: storage, fileFilter: imageFilter})
	
	var cloudinary = require('cloudinary');
	cloudinary.config({ 
	  cloud_name: 'eagle2501', 
	  api_key: process.env.CLOUDINARY_API_KEY, 
	  api_secret: process.env.CLOUDINARY_API_SECRET
	});

//upload image
app.post("/upload",upload.single("myImage"),function(req,res){
	cloudinary.uploader.upload(req.file.path, function(result) {
		// add cloudinary url for the image to the campground object under image property
		User.findByIdAndUpdate(req.user._id,{profilepic:result.secure_url},function(err,updatedprofile){
			if(err){
				console.log(err);
			}else{
				res.redirect("back");
			}
		})
})
})


//INDEX
app.get('/', function(req, res) {
	res.render('landing');
});

//INDEX ROUTE
app.get('/home', function(req, res) {
	res.render('home');
});



//plans index
app.get('/plans', function(req, res) {
	Plan.find({}, function(err, allplans) {
		if (err) {
			console.log(err);
		} else {
			res.render('plans', { plans: allplans });
		}
	});
});

//plans show
app.get("/plans/:id",function(req,res){
	Plan.findById(req.params.id,function(err,foundPlan){
		if(err){
			console.log(err.message);
		}else{
			Plan.find({},function(err,allplans){
				if(err){
					console.log(err);
				}else{
					res.render("show",{plan:foundPlan,plans:allplans});
				}
			})
		}
	})
})

//================================
//ROUTERS ROUTES
//===============================

//router index
app.get("/routers",function(req,res){
	Router.find({},function(err,routers){
		if(err){
			console.log(err);
		}else{
			res.render("WRouter/routersindex",{routers:routers})
		}
	})
})

//router show
app.get("/routers/:id",function(req,res){
	Router.findById(req.params.id,function(err,foundrouter){
		if(err){
			console.log(err);
		}else{
			res.render("WRouter/routershow",{router:foundrouter});
		}
	})
})

//=================
//new connection route
//==================

//new connection from user side
app.get("/new-connection/new",isLoggedIn,function(req,res){
	res.render("newcon");
})

//==========================
//ADMIN ROUTES
//==========================

//dashboard getting all counts
app.get("/admin",function(req,res){
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
app.get("/admin/request/new-connection/:id",function(req,res){
	NewCon.findById(req.params.id,function(err,foundnewcon){
		if(err){
			console.log(err);
		}else{
			res.render("admin/newconreqshow",{newcon:foundnewcon});
		}
	})
})
//index for newcon reqs
app.get("/admin/request/new-connection",function(req,res){
	NewCon.find({},function(err,newcons){
		if(err){
			console.log(err);
		}else{
			res.render("admin/adminnewcon",{newcons:newcons})
		}
	})
})

//router admin(still pending)
app.get("/admin/request/new-router",function(req,res){
	res.send("Routers admin");
})

//index for support tickets (admin)
app.get("/admin/support",function(req,res){
	Support.find({},function(err,allsupport){
		if(err){
			console.log(err);
		}else{
			res.render("admin/adminsupport",{allsupport:allsupport});
		}
	})
})
//posting support to admin
app.post("/admin/support",function(req,res){
	console.log(req.body);
	const data={
		type:req.body.type,
		comment:req.body.comment,
		status:"Pending",
		date:moment().format(),
		author: {
			id:req.user._id,
			username:req.user.username
		}
	}
	Support.create(data,function(err,newsupport){
		console.log(req.user);
		if(err){
			console.log(err);
		}else{
			console.log(newsupport)
			res.redirect("/home");
		}
	})
})

//show page for tickets admin
app.get("/admin/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.render("admin/ticketshow",{ticket:ticket});
		}
	})
})

//update route for ticket status
app.put("/admin/support/:id",function(req,res){
	Support.findByIdAndUpdate(req.params.id,{status:"Solved"},function(err,updatedticket){
		if(err){
			console.log(err);
		}else{
			res.redirect("/admin/support");
		}
	})
})




//posting router req to admin
app.post("/admin/request/new-router",isLoggedIn,function(req,res){
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
app.post("/admin/request/new-connection",isLoggedIn,function(req,res){ 

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
				username:req.user.username
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


//============================
//SUPPORT routes
//============================

//user side viewing tickets
app.get("/support",function(req,res){
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
app.get("/support/new",isLoggedIn,function(req,res){
	res.render("support");
})

//show for userside ticket
app.get("/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.json(ticket);
		}
	})
})

app.put("/support/:id",function(req,res){
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
app.delete("/support/:id",function(req,res){
	Support.findByIdAndRemove(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}
	})
})


//===================
//Customer routes
//===================

//index for viewing all users
app.get("/users",function(req,res){
  User.find().where("isConUser").equals("true").exec(function(err,allusers){
	  if(err){
		  console.log(err);
	  }else{
		  res.render("admin/user",{users:allusers})
	  }
  })
})

app.get("/users/:id",function(req,res){
	User.findById(req.params.id,function(err,user){
		if(err){
			console.log(err);
		}else{
			res.render("admin/usershow",{user:user});
		}
	})
})

//my profile for user
app.get("/user/:id",function(req,res){
	if(req.xhr){
		User.findById(req.params.id,function(err,founduser){
			if(err){
				console.log(err);
			}else{
				res.json(founduser)
			}
		})
	}else{
		res.render("myprofile");
	}
})

//editing route for myprofile user
app.put("/user/:id/edit",function(req,res){
	User.findByIdAndUpdate(req.params.id,req.body,{new:true},function(err,updated){
		if(err){
			console.log(err);
		}else{
			res.json(updated);
		}
	})
})

//admin side updating(aprroval of newcon application) isConUser
app.put("/user/:id",function(req,res){
	let pack;
	let rental;
	const phone=req.body.phone;
	const ad1=req.body.address;
	const ad2=req.body.locality;
	const address=ad1+","+ad2;
	const plan=req.body.plan;
	const lat=req.body.lat;
	const lng=req.body.lng;
	const isConUser=true;
	switch(plan){
		case "ACT Blaze":
			pack="450 GB " ;
			rental=1059;
			break;
		case "ACT Swift":
			pack="200 GB" ;
			rental=685;
			break;
		case "ACT Lighting":
			pack="800 GB";
			rental=1399;
			break;
		case "ACT Rapid Plus":
			pack="350 GB" ;
			rental=959;
			break;
		case "ACT Storm":
			pack="650 GB";
			rental=1159;
			break;		
	}
    const data={
		phone:phone,
		address:address,
		plan:plan,
		isConUser:isConUser,
		data:{
			total:pack
		},	
		rental:rental,
		lat:lat,
		lng:lng
	}
	User.findByIdAndUpdate(req.params.id,data,function(err,updateduser){
		if(err){
			console.log(err);
		}else{
		NewCon.deleteOne().where("author.id").equals(req.params.id).exec(function(err,deleted){
			console.log(updateduser);
			res.redirect("/admin");
		})
		}
	})
})





//===================
//Auth Routes
//===================
app.get("/register",function(req,res){
	res.render("register");
})

//Sign up logic
app.post("/register",function(req,res,next){
	const newUser= new User({
		username:req.body.username,
		name:req.body.name,
		email:req.body.email,
	});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/home"); 
		})
	})
})

//show login form
app.get("/login",function(req,res){
	res.render("login");
})
//handling login logic
app.post("/login",passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/login"
}))
//logout route
app.get("/logout",function(req,res){
	req.logOut();
	res.redirect("/home");
})

app.get("/forgot",function(req,res){
	res.render("forgot");
})

app.post('/forgot', function(req, res, next) {
	async.waterfall([
	  function(done) {
		crypto.randomBytes(20, function(err, buf) {
		  var token = buf.toString('hex');
		  done(err, token);
		});
	  },
	  function(token, done) {
		User.findOne({ email: req.body.email }, function(err, user) {
		  if (!user) {
			// req.flash('error', 'No account with that email address exists.');
			return res.redirect('/forgot');
		  }
  
		  user.resetPasswordToken = token;
		  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
		  user.save(function(err) {
			done(err, token, user);
		  });
		});
	  },
	  function(token, user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'actproject25@gmail.com',
			pass: process.env.GMAILPW
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'actproject25@gmail.com',
		  subject: 'ACT Password Reset',
		  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  console.log('mail sent');
		//   req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
		  done(err, 'done');
		});
	  }
	], function(err) {
	  if (err) return next(err);
	  res.redirect('/forgot');
	});
  });

app.get('/reset/:token', function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	  if (!user) {
		// req.flash('error', 'Password reset token is invalid or has expired.');
		return res.redirect('/forgot');
	  }
	  res.render('reset', {token: req.params.token});
	});
  });
  
app.post('/reset/:token', function(req, res) {
	async.waterfall([
	  function(done) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		  if (!user) {
			// req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('back');
		  }
		  if(req.body.password === req.body.confirm) {
			user.setPassword(req.body.password, function(err) {
			  user.resetPasswordToken = undefined;
			  user.resetPasswordExpires = undefined;
  
			  user.save(function(err) {
				req.logIn(user, function(err) {
				  done(err, user);
				});
			  });
			})
		  } else {
			//   req.flash("error", "Passwords do not match.");
			  return res.redirect('back');
		  }
		});
	  },
	  function(user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'actproject25@gmail.com',
			pass: process.env.GMAILPW
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'actproject25@gmail.com',
		  subject: 'Your password has been changed',
		  text: 'Hello,\n\n' +
			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		//   req.flash('success', 'Success! Your password has been changed.');
		  done(err);
		});
	  }
	], function(err) {
	  res.redirect('/home');
	});
  });




function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Project Started');
});
