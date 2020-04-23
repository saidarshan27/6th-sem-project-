const express = require("express");
	  router  = express.Router();
	  User    = require("../models/user");
	  cloudinary = require('cloudinary');
       multer=require("multer");

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

router.post("/upload",upload.single("myImage"),function(req,res){
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

module.exports=router;