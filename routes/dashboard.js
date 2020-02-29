const express = require('express');
const router = express.Router();
const app = express();
var request = require('request-promise');

var transaction = require("../model/transaction");

router.get('/', (req, res) => {
    res.render('home');
});
router.get('/transaction', (req, res) => {
    transaction.find({}).sort('-_id').limit(50).exec(function(err, transaction) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(transaction);
            res.render("transaction", { transaction: transaction });
        }
    });
});
router.post('/speech', (req, res) => {
    var data = {
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
        then(function (newdata) {
            op = newdata.operation.toLowerCase();
            
            //CREATE OPERATION
            if ((op == "create" ||op ==  "make" ||op == 'generate' ||op == 'produce') && Object.keys(newdata).length >3){
                delete newdata.operation;
                console.log(newdata);
                transData = {
                    DATE: newdata.DATE?newdata.DATE:"None",
                    sku: newdata.sku?newdata.sku:"None",
                    company: newdata.company?newdata.company:"None",
                    quantity: newdata.quantity?newdata.quantity:"None",
                };
                transaction.create(transData, (err, transaction) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Data saved successfully");
                        res.redirect('/transaction');
                    }
                });
            }


            //DELETE OPERAION
            else if(op == 'delete'||op == 'remove'||op == 'cancel'){
                delete newdata.operation;
                console.log(newdata);
                if(newdata.count != undefined){
                    transaction.find({}).sort('-_id').limit(parseInt(newdata.count)).exec(function(err, trans){
                        if(err){
                            console.log(err);
                        }
                        else{
                            var ID = [];
                            trans.forEach(function(t){
                                ID.push(t._id);
                            });
                            
                            transaction.deleteMany({_id:{$in:ID}},function(err,result){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("Data removed successfully");
                                    res.redirect('/transaction');
                                }
                            });
                        }
                    });
                }
                else{
                    transaction.deleteMany(newdata, function(err,result){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Data removed successfully");
                            res.redirect('/transaction');
                        }
                    });
                }
            }

            //SEARCH OPERATION
            else if(op == 'list'|| op =='search'|| op == 'show'|| op == 'display'){
                delete newdata.operation;
                console.log(newdata);
                if(newdata.count != undefined){
                    transaction.find({}).sort('-_id').limit(parseInt(newdata.count)).exec(function(err,trans){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(trans);
                            res.render('transaction',{transaction:trans});
                        }
                    });
                }
                else{
                    transaction.find(newdata,function(err,transaction){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(transaction);
                            res.render('transaction',{transaction:transaction});
                        }
                    });
                }

            }
            else if(op == 'update'|| op =='correct'|| op == 'rectify'){
                delete newdata.operation;
                var set = newdata.set;
                delete newdata.set;
                transaction.updateMany(newdata, { $set: set},function(err,res){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(res);
                    }
                });

            }
            else{
                console.log("Please provide more Info");
                res.redirect('/');
            }
        })
        .catch(function (err) {
            console.log(err);
        });
});

function compare(a, b) {
    if (a._id < b._id) {
        return 1;
    }
    if (a._id > b._id) {
        return -1;
    }
    return 0;
}

module.exports = router;