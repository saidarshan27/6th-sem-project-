require("dotenv").config();

const express = require('express');
const app = express();
const methodOverride=require("method-override");
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const passport =require("passport");
const LocalStrategy=require("passport-local");
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

mongoose
	.connect('mongodb+srv://saidarshan:R@mb02501@cluster0-wjhf4.mongodb.net/project?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to DB');
	})
	.catch((err) => {
		console.log('ERROR', err.message);
	});


app.get('/', function(req, res) {
	res.render('landing');
});

//INDEX ROUTES
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
app.post("/routers",function(req,res){
	
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

app.get("/new-connection/new",isLoggedIn,function(req,res){
	res.render("newcon");
})

//==========================
//ADMIN ROUTES
//==========================
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


//posting new-con req to admin
app.post("/admin/request/new-connection",isLoggedIn,function(req,res){ 
var name=req.body.name;
var phone=req.body.phone;
var plan=req.body.plan;
var address=req.body.address;
var email=req.body.email;
var locality=req.body.locality;
var geoadress=address+","+locality;
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
			}
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

app.get("/support/new",isLoggedIn,function(req,res){
	res.render("support");
})

app.get("/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.json(ticket);
		}
	})
})

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

app.put("/user/:id",function(req,res){
	const phone=req.body.phone;
	const ad1=req.body.address;
	const ad2=req.body.locality;
	const address=ad1+ad2;
	const plan=req.body.plan;
	const isConUser=true;
    const data={
		phone:phone,
		address:address,
		plan:plan,
		isConUser:isConUser
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
