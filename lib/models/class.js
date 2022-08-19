'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    duration: Number,
    frequency: String,
    cost: Number,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', classSchema);
