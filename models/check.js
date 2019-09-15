const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkSchema = new Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    Date: {
        type: Date,
        required: true
    },
    isChecked: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Check', checkSchema);