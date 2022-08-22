'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calificationSchema = new Schema({
    score: {
        type: Number,
        required: true
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Calification', calificationSchema);