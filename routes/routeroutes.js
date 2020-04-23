require("dotenv").config();
const express = require('express'),
	router = express.Router();
RouterDB = require('../models/routers.js');
Razorpay = require('razorpay');
CryptoJS = require('crypto-js');
sha256 = require('crypto-js/sha256'),
 Payment= require('../models/payments');
 nodemailer=require("nodemailer");
 middleware = require("../middleware/index");


//================================
//ROUTERS ROUTES
//===============================
const RazorpayConfig = {
	key_id: process.env.razorpay_key_id,
	key_secret: process.env.razorpay_key_secret
};
var instance = new Razorpay(RazorpayConfig);

//router index
router.get('/routers', function(req, res) {
	RouterDB.find({}, function(err, routers) {
		if (err) {
			console.log(err);
		} else {
			res.render('WRouter/routersindex', { routers: routers });
		}
	});
});

router.get('/routers/:id',middleware.isLoggedIn,function(req, res) {
	RouterDB.findById(req.params.id, function(err, foundrouter) {
		if (err) {
			console.log(err);
		} else {
			res.render('WRouter/routershow', { router: foundrouter });
		}
	});
});

router.post('/router/payment/success', function(req, res) {
	const generated_signature = CryptoJS.HmacSHA256(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id,process.env.razorpay_key_secret);
	if (generated_signature == req.body.razorpay_signature) {
		instance.payments.fetch(req.body.razorpay_payment_id).then((data) => {
			const amount=data.amount;
			sendmail(amount,req);
			const DBdata={
				payment_id:data.id,
				amount:data.amount,
				status:data.status,
				method:data.method,
				orderid:data.order_id,
				author: {
					id:req.user._id,
					name:req.user.name
				},
				purpose:data.description
			}
			Payment.create(DBdata,function(err,newpayment){
				if(err){
					console.log(err);
				}else{
					console.log("payment data stored");
				}
			})
		}).catch((error) => {
			console.log(error);
		})
		console.log('payment successfull');
	}else{
		console.log("payment failure");
	}
});

router.post('/router/payment',middleware.isLoggedIn,function(req, res) {
	const price = req.body.price + '00';
	var options = {
		amount: price, // amount in the smallest currency unit
		currency: 'INR',
		receipt: 'order_rcptid_11',
		payment_capture: '0'
	};
	instance.orders.create(options, function(err, order) {
		console.log(order);
		res.json(order);
	});
});



function sendmail(amount,req){
	const stramount = amount.toString();
	const max = stramount.length;
	const sliceamount = stramount.slice(0, max - 2);
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail', 
				auth: {
					user: 'actproject25@gmail.com',
					pass: process.env.GMAILPW
				}
			});
			var mailOptions = {
				to: req.user.email,
				from: 'actproject25@gmail.com',
				subject: 'Thank you for placing a router order',
				text: 'Hello ,\n\n' +
					'We have succesfully receieved your payment of Rs.'+ sliceamount +'\n\n' +
					'Thank you for ordering a router from us. \n\n' +
					'This is your payment id:'+ req.body.razorpay_payment_id
			};
			smtpTransport.sendMail(mailOptions, function(err) {
					if(err){
							console.log(err);
					}else{
						console.log('mail sent');
					}
			});
}




module.exports = router;
