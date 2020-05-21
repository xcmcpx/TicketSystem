const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    data: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Note', noteSchema);