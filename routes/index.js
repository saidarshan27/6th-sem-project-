require("dotenv").config();
const express = require("express"),
	router = express.Router(),
	User = require("../models/user"),
	async = require("async"),
	nodemailer = require("nodemailer"),
	crypto = require("crypto"),
	passport = require("passport"),
	FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: 'http://localhost:3000/auth/facebook/callback',
	profileFields: ["email", "name", "picture.type(large)"]
},
	function (accessToken, refreshToken, profile, done) {
		const picture = `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`
		User.findOne({ 'email': profile._json.email }, function (err, user) {
			if (err) {
				done(err);
			} else {
				if (user) {
					return done(null, user);
				} else {
					const data = {
						email: profile._json.email,
						name: profile._json.first_name + profile._json.last_name,
						isFB: true,
						profilepic: picture
					}
					User.create(data, function (err, newuser) {
						if (err) {
							console.log(err);
						} else {
							var smtpTransport = nodemailer.createTransport({
								service: 'Gmail',
								auth: {
									user: 'actproject25@gmail.com',
									pass: process.env.GMAILPW
								}
							});
							var mailOptions = {
								to: profile._json.email,
								from: 'actproject25@gmail.com',
								subject: 'Welcome to ACT',
								text: 'Welcome to ACT.Thank you for signing up\n\n'
							};
							smtpTransport.sendMail(mailOptions, function (err) {
								console.log('mail sent');
							});
							console.log(newuser);
							return done(null, newuser);
						}
					})
				}
			}
		})
	}
));


//INDEX routes
router.get('/', function (req, res) {
	res.redirect("/home");
});

//===================
//Auth Routes
//===================
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook',
	{
		successRedirect: '/home',
		failureRedirect: '/login'
	}
));



router.get("/register", function (req, res) {
	res.render("register");
})

//Sign up logic
router.post("/register", function (req, res, next) {
	const newUser = new User({
		username: req.body.username,
		name: req.body.name,
		email: req.body.email,
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		} else {
			passport.authenticate("local")(req, res, function () {
				req.flash("success", "Successfully registered.Welcome " + req.user.name);
				res.redirect("/home");
			})
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
				subject: 'Welcome to ABP',
				text: 'Welcome to ABP.Thank you for signing up\n\n' +
					'These are your credentials:\n\n' +
					'username:' + user.username + '\n\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log('mail sent');
				}
			});
		}
	})
})

//isEmailAvailable
router.post("/register/isEmailAvailable", (req, res) => {
	const data = req.body;
	User.findOne(data, function (err, user) {
		if (err) {
			console.log(err);
		} else {
			if (user) {
				res.json("");
			} else {
				res.json(true);
			}
		}
	})
})

//isUsernameAvailable
router.post("/register/isUsernameAvailable", (req, res) => {
	const data = req.body;
	User.findOne(data, function (err, user) {
		if (err) {
			console.log(err);
		} else {
			if (user) {
				res.json("");
			} else {
				res.json(true);
			}
		}
	})
})

//show login form
router.get("/login", function (req, res) {
	res.render("login");
})
//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/login",
	failureFlash: true
}))

//logout route
router.get("/logout", function (req, res) {
	req.logOut();
	req.flash("success", "Logged you out");
	res.redirect("/home");
})

router.get("/forgot", function (req, res) {
	res.render("forgot");
})

router.post('/forgot', function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function (err) {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
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
			smtpTransport.sendMail(mailOptions, function (err) {
				console.log('mail sent');
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function (err) {
		if (err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/reset/:token', function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('reset', { token: req.params.token });
	});
});

router.post('/reset/:token', function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}
				if (req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function (err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							req.logIn(user, function (err) {
								done(err, user);
							});
						});
					})
				} else {
					req.flash("error", "Passwords do not match.");
					return res.redirect('back');
				}
			});
		},
		function (user, done) {
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
			smtpTransport.sendMail(mailOptions, function (err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function (err) {
		res.redirect('/home');
	});
});



module.exports = router;