const express = require('express');
const router = express.Router();
const app = express();
const request = require('request-promise');
const middleware = require('../middleware/middleware');
const transaction = require("../model/transaction");



router.get('/',middleware.isLoggedIn, (req, res) => {
    res.render('home',{page:"home"});

});
router.get('/transaction', middleware.isLoggedIn,(req, res) => {
    transaction.find({}).sort('-_id').limit(50).exec(function(err, transaction) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(transaction);
            res.render("transaction", { transaction: transaction,rate:10,page:"transaction",});
        }
    });
});
router.post('/speech', middleware.isLoggedIn,(req, res) => {
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
                        
                        req.flash("success","Transaction saved successfully");
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
                                    req.flash("success","Transaction has been removed successfully");
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
                            if(result.deletedCount == 0){
                                console.log(result);
                                req.flash("error","No such transaction was found");
                                console.log("No Tranasction Found");
                                res.redirect('/');    
                            }
                            else{
                                console.log(result);
                                req.flash("success","Transaction has been removed successfully");
                                console.log("Data removed successfully");
                                res.redirect('/transaction');
                            }
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
                            if(trans.length == 0){
                                req.flash('error','Could not find any matching transaction');
                                return res.redirect('/');
                            }
                            console.log(trans);
                            var success = 'These are the list of transactions you requested';
                            res.render('transaction',{transaction:trans ,rate:10,success:success,page:"transaction"});
                        }
                    });
                }
                else{
                    transaction.find(newdata,function(err,transaction){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(transaction.length == 0){
                                req.flash('error','Could not find any matching transaction');
                                return res.redirect('/');
                            }
                            console.log(transaction);
                            success='These are the list of transactions you requested';
                            res.render('transaction',{transaction:transaction, rate:10,success:success,page:"transaction"});
                        }
                    });
                }

            }
            //UPDATE
            else if(op == 'update'|| op =='correct'|| op == 'rectify'){
                delete newdata.operation;
                var setData = newdata.set;
                delete newdata.set;
                console.log(setData);
                console.log(newdata);
                if(Object.keys(newdata).length != 0){
                    transaction.updateMany(newdata, { $set: setData},function(err,result){
                        if(err){
                            console.log(err);
                        }
                        else{
                            req.flash("success","Transaction details have been Updated");
                            console.log(res);
                            res.redirect('/');
                        }
                    });
                }
                else{
                    req.flash("error","Insufficient Data! Cannot update Transaction!!");
                    console.log("Cannot update transaction");
                    res.redirect('/');
                }

            }
            else{
                req.flash("error","Insufficient Data! Please provide more Information");
                console.log("Please provide more Info");
                res.redirect('/');
            }
        })
        .catch(function (err) {
            console.log(err);
        });
});


module.exports = router;