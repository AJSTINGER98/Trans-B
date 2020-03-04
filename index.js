//Import npm modules
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");

//Import Routes
const dashRoute = require("./routes/dashboard");
const authRoute = require("./routes/authentication");

//Connect to database (local database)
mongoose.connect("mongodb://localhost:27017/mydb2",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

//Use flash
app.use(flash());

//Import Schema
const User = require("./model/user");

//set default view and default directories
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/Utilities"));

//Enable body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//configure passport

app.use(require("express-session")({
	secret: "Once Again You have no clue what the password is",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req , res , next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Call Routes
app.use("/",dashRoute);
app.use("/",authRoute);

//Start Server
app.listen(process.env.port||3000, () =>{
    console.log('running');
});