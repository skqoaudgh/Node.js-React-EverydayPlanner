const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    Creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Date: {
        type: Date,
        required: true
    },
    Deadline: {
        type: Date,
        required: true
    },
    RepeatOption: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Detail: {
        type: String,
        required: true
    },
    IsDone: {
        type: Boolean,
        required: true
    },
    Marker: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Plan', planSchema);