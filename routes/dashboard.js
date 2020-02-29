const express = require('express');
const router = express.Router();
const app = express();
var request = require('request-promise');

const supervisor = require("../models/supervisor");

router.get('/',(req,res) =>{
    res.render('home');
});
router.post('/speech', (req,res) => {
    var data ={
        text: req.body.text,
    };
    console.log(req.body.text);
    var options = {
        method: 'POST',
        uri: 'http://127.0.0.1:5000/postdata',
        body: data,
        json: true 
    };
    var sendrequest = request(options).
    then(function(newdata){


    })
    .catch(function(err){
        console.log(err);
    });
    res.redirect('/');
});

module.exports = router;