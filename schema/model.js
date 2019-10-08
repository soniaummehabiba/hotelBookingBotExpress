const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    name: String,
    email: String,
    roomType: String,
    persons: Number
});

var Order = mongoose.model('Order', ordersSchema);

module.exports = {Order};