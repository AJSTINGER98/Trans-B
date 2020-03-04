const transaction = require("../model/transaction");
const User = require("../model/user");

var middlewareObject = {};

//middleware

middlewareObject.isLoggedIn = function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error" , "Not Logged In");
	res.redirect("/login");
};

module.exports = middlewareObject;