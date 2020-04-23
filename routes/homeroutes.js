const express  = require("express"),
      router   = express.Router();
			Plan     = require("../models/plans");

router.get('/home', function(req, res) {
	res.render('home');
});


//plans index
router.get('/plans', function(req, res) {
	Plan.find({}, function(err, allplans) {
		if (err) {
			console.log(err);
		} else {
			res.render('plans', { plans: allplans });
		}
	});
});

//plans show
router.get("/plans/:id",function(req,res){
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

module.exports= router;