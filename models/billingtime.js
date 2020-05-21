const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const billingTimeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    time: {
        type: Number,
        required: true,
        default: 0
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

module.exports = mongoose.model('BillingTime', billingTimeSchema);