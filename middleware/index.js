var middlewareObj = {}

middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }else{
      req.flash("error","Please Login First");
      res.redirect("/login");
    }
  }



module.exports = middlewareObj;