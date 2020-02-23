const express = require('express');
const app = express();
// const bodyParser = require("body-parser");



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/Utilities"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const dashRoute = require("./routes/dashboard");

app.use("/",dashRoute);

app.listen(process.env.port||3000, () =>{
    console.log('running');
});