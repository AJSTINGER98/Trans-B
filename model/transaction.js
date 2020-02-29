const mongoose = require("mongoose");


transactionSchema = new mongoose.Schema({
    DATE: Date,
    sku: String,
    company: String,
    quantity: String,
});


module.exports = mongoose.model("transaction",transactionSchema);
