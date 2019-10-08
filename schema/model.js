const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    roomType: String,
    persons: Number
});

var Order = mongoose.model('order', orderSchema);

module.exports = {Order};