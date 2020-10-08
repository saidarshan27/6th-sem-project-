require("dotenv").config();
const express = require("express");
router = express.Router();
User = require("../models/user");
Razorpay = require('razorpay');
CryptoJS = require('crypto-js');
sha256 = require('crypto-js/sha256'),
    Payment = require('../models/payments'),
    nodemailer = require("nodemailer");
middleware = require("../middleware");


const RazorpayConfig = {
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret
};
var instance = new Razorpay(RazorpayConfig);

//===================
//Customer routes
//===================

//index for viewing all users
router.get("/users", function (req, res) {
    User.find().where("isConUser").equals("true").exec(function (err, allusers) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/user", { users: allusers })
        }
    })
})

router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render("admin/usershow", { user: user });
        }
    })
})


//payment init
router.post('/due/payment', middleware.isLoggedIn, function (req, res) {
    const price = req.body.price + '00';
    var options = {
        amount: price, // amount in the smallest currency unit
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: '0'
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.json(order);
    });
});

//verifying and storing payment
router.post('/due/payment/success', function (req, res) {
    const generated_signature = CryptoJS.HmacSHA256(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id, process.env.razorpay_key_secret);
    if (generated_signature == req.body.razorpay_signature) {
        instance.payments.fetch(req.body.razorpay_payment_id).then((data) => {
            const amount = data.amount;
            sendmail(amount, req);
            const DBdata = {
                payment_id: data.id,
                amount: data.amount,
                status: data.status,
                method: data.method,
                orderid: data.order_id,
                author: {
                    id: req.user._id,
                    name: req.user.name
                },
                purpose: data.description
            }
            Payment.create(DBdata, function (err, newpayment) {
                if (err) {
                    console.log(err);
                } else {
                    User.findByIdAndUpdate(req.user._id, { "rental.due": 0 }, function (err, updatedue) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log("payment data stored");
                }
            })
        }).catch((error) => {
            console.log(error);
        })
        console.log('payment successfull');
    } else {
        console.log("payment failure");
    }
});


//my profile for user
router.get("/user/:id", middleware.isLoggedIn, function (req, res) {
    if (req.xhr) {
        User.findById(req.params.id, function (err, founduser) {
            if (err) {
                console.log(err);
            } else {
                res.json(founduser)
            }
        })
    } else {
        res.render("myprofile");
    }
})

//editing route for myprofile user
router.put("/user/:id/edit", function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            res.json(updated);
        }
    })
})

//admin side updating(aprroval of newcon application) isConUser
router.put("/user/:id", function (req, res) {
    let pack;
    let rental;
    const phone = req.body.phone;
    const ad1 = req.body.address;
    const ad2 = req.body.locality;
    const address = ad1 + "," + ad2;
    const plan = req.body.plan;
    console.log(plan);
    const lat = req.body.lat;
    const lng = req.body.lng;
    const isConUser = true;
    switch (plan) {
        case "ABP Blaze":
            pack = "450 GB";
            rental = 1059;
            break;
        case "ABP Swift":
            pack = "200 GB";
            rental = 685;
            break;
        case "ABP Lighting":
            pack = "800 GB";
            rental = 1399;
            break;
        case "ABP Rapid Plus":
            pack = "350 GB";
            rental = 959;
            break;
        case "ABP Storm":
            pack = "650 GB";
            rental = 1159;
            break;
    }
    const data = {
        phone: phone,
        address: address,
        plan: plan,
        isConUser: isConUser,
        data: {
            total: pack,
            used: 0
        },
        rental: {
            total: rental,
            due: rental
        },
        lat: lat,
        lng: lng
    }
    User.findByIdAndUpdate(req.params.id, data, { new: true }, function (err, updateduser) {
        if (err) {
            console.log(err);
        } else {
            NewCon.deleteOne().where("author.id").equals(req.params.id).exec(function (err, deleted) {
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
                        to: updateduser.email,
                        from: 'actproject25@gmail.com',
                        subject: 'New Connection Approval',
                        text: 'Your application for new connection has been aprroved \n\n' +
                            'Your choosen plan is:' + updateduser.plan + '\n' +
                            'Your monthly rental will be:' + updateduser.rental.total + '\n'
                    };
                    smtpTransport.sendMail(mailOptions, function (err) {
                        console.log('mail sent');
                    });
                    console.log(updateduser);
                    res.redirect("/admin");
                }
            })
        }
    })
})





function isAdmin(req, res, next) {
    if (req.user.isAdmin == true) {
        return next();
    } else {
        res.redirect("/home");
    }
}

function sendmail(amount, req) {
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
        subject: 'Thank you for clearing your monthly due',
        text: 'Hello ,\n\n' +
            'We have succesfully receieved your payment of Rs.' + sliceamount + '\n\n' +
            'This is your payment id:' + req.body.razorpay_payment_id
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('mail sent');
        }
    });
}

module.exports = router;