const express = require("express");
const router = express.Router(); 
const passport = require("passport");
const User = require("../model/user");

//register

router.get("/register",function(req ,res){
	res.render("register" , {page: 'register'});  //page is used to make sign up icon active
});

router.post("/register",function(req , res){

	if(req.body.password != req.body.r_password){
		req.flash("error","Password does not match. Please try again");
		res.redirect('/register');
	}
	else{
		User.register(new User({username: req.body.username,fname:req.body.f_name,lname:req.body.l_name}) , req.body.password,function(err , user){
			if(err){
				req.flash("error" , err.message);
				return res.redirect("/register");
			}
			passport.authenticate("local")(req , res , function(){
				req.flash("success" , "Welcome " + user.username + ". I am Janice. I will be assisting you with all your business transactions.");
				res.redirect("/");
			});

		});
	}
});

//login
router.get("/login",function(req ,res){
	res.render("login" , {page: 'login'}); 
});

router.post("/login", passport.authenticate("local" ,{
	failureRedirect: "/login",
	failureFlash: true,
}) , function(req ,res){
	req.flash('success','Welcome Back '+ req.body.username);
	res.redirect("/");
});

//logout
router.get("/logout",function(req, res){
	req.logout();
	req.flash("success" , "Logged out Successfully");
	res.redirect("/login");
});

module.exports = router;