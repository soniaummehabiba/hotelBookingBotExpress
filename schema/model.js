const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: String,
    email: String,
    roomType: String,
    persons: Number,
    created_at: {
        type: Date,
        default: Date.now
    }
});

var Order = mongoose.model('order', orderSchema);

module.exports = {Order};