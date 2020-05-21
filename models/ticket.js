const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedUser:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    closed: {
        type: Boolean,
        required: false,
        default: false
    },
    status:{
        type: Number,
        required: false,
        default: 1,
    },
    hours: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BillingTime'
        }
    ],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);