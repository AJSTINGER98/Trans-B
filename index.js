const express = require('express');

const app = express();

app.use(methodOverride("_method"));

app.use(express.static(_dirname + "/public"));
app.use(express.static(_dirname + "/views"));
app.use(express.static(_dirname + "/Utilities"));

app.listen(process.env.port||3000, () =>{
    console.log('running');
});