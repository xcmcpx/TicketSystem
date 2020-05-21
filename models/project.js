const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    associatedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    tickets: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
        }
    ]
});

module.exports = mongoose.model('Project', projectSchema);