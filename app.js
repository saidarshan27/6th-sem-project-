require("dotenv").config();

const express       = require('express');
const app           = express();
const methodOverride=require("method-override");
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const CronJob=require("cron").CronJob;
const passport =require("passport");
const LocalStrategy=require("passport-local");
var FacebookStrategy = require('passport-facebook').Strategy;
const multer=require("multer");
const async=require("async");
const nodemailer=require("nodemailer");
const crypto=require("crypto");
const flash = require("connect-flash");
const Insta =  require("instamojo-nodejs");
var Plan=require("./models/plans");
const Router=require("./models/routers");
const NewCon=require("./models/newconreq");
const NewRouter=require("./models/Nroutereq");
const User=require("./models/user");
const Support=require("./models/newsupport");
const NodeGeocoder = require('node-geocoder');
const moment       = require("moment-timezone");
let Razorpay=require("razorpay");



const adminRoutes      = require("./routes/adminroutes"),
	  cloudinaryRoute  = require("./routes/cloudinary"),
	  cronjobs         = require("./config/cronjobs"),
	  customerRoutes   = require("./routes/customeroutes"),
	  homeRoutes       = require("./routes/homeroutes"),
	  indexRoutes      = require("./routes/index"),
	  newconRoutes     = require("./routes/newconncetionroute"),
	  routerRoutes     = require("./routes/routeroutes"),
	  supportRoutes    = require("./routes/supportroutes");
	  cron             = require("./config/cronjobs");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.locals.moment=moment;
moment.tz.setDefault("Asia/Kolkata");
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"CSGO is the best game",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
	done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
	User.findById(user._id,function(err,user){
		done(null, user);
	})
  });
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
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


app.use(adminRoutes);
app.use(cloudinaryRoute);
app.use(customerRoutes);
app.use(homeRoutes);
app.use(indexRoutes);
app.use(newconRoutes);
app.use(routerRoutes);
app.use(supportRoutes);
	
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Project Started');
});
