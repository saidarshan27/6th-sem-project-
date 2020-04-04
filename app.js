require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
var Plan=require("./models/plans");
const Router=require("./models/routers");
const NewCon=require("./models/newconreq");
const NewRouter=require("./models/Nroutereq");
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



// const data = [
// 	{
// 		name: 'ACT Swift',
// 		speed: '40 Mbphs',
// 		data: '200 GB',
// 		postfup: ' 512 Kbps',
// 		rental: 'Rs.685'
// 	},
// 	{
// 		name: 'ACT Rapid Plus',
// 		speed: '75 Mbphs',
// 		data: '350 GB',
// 		postfup: ' 512 Kbps',
// 		rental: 'Rs.959'
// 	},
// 	{
// 		name: 'ACT Blaze',
// 		speed: '100 Mbps',
// 		data: '450 GB',
// 		postfup: ' 1 Mbps',
// 		rental: 'Rs.1059'
// 	},
// 	{
// 		name: 'ACT Storm',
// 		speed: '150 Mbps',
// 		data: '650 GB',
// 		postfup: ' 1 Mbps',
// 		rental: 'Rs.1159'
// 	},
// 	{
// 		name: 'ACT Lightning',
// 		speed: '200 Mbps',
// 		data: '800 GB',
// 		postfup: ' 1 Mbps',
// 		rental: 'Rs.1399'
// 	}
// ];

// Router.create({
// 	name:"T1 Router",
// 	price:"Rs.999",
// 	image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT7ZAmUcKo6W4xTIHYVzvRCEGOg9M2CqGcKh0ZG8ro1iVySGM4J"
// },function(err,newrouter){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("ADDED NEW ROUTER");
// 	}
// })

// Plan.create(data, function(err, plans) {
// 	if (err) {
// 		console.log(err.message);
// 	} else {
// 		console.log('PLANS ADDED');
// 	}
// });

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

app.get("/new-connection/new",function(req,res){
	res.render("newcon");
})

//==========================
//ADMIN ROUTES
//==========================
app.get("/admin",function(req,res){
	res.render("admin/admin");
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
app.get("/admin/support/:id",function(req,res){
	Support.findById(req.params.id,function(err,ticket){
		if(err){
			console.log(err);
		}else{
			res.render("admin/ticketshow",{ticket:ticket});
		}
	})
})
//posting route req to admin
app.post("/admin/request/new-router",function(req,res){
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
app.post("/admin/request/new-connection",function(req,res){ 
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
		const newcondata={name:name,phone:phone,address:address,plan:plan,email:email,locality:locality,lat:lat,lng:lng}
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
app.get("/support",function(req,res){
	Support.find({},function(err,allsupport){
		if(err){
			console.log(err);
		}else{
			res.json(allsupport);
		}
	})
})

app.get("/support/new",function(req,res){
	res.render("support");
})


app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Project Started');
});
