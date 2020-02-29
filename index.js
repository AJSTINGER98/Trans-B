//Import npm modules
const express = require('express');
const app = express();
const mongoose = require("mongoose");

//Connect to database (local database)
mongoose.connect("mongodb://localhost:27017/mydb2",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

//Import models
// const trans = require("./models/transaction");

//set default view and default directories
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/Utilities"));

//Enable body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Import Routes
const dashRoute = require("./routes/dashboard");

//Call Routes
app.use("/",dashRoute);

//Start Server
app.listen(process.env.port||3000, () =>{
    console.log('running');
});