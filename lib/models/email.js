'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sended: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0
    },
    logs: [String],
    referenceClass: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    type: {
        type: String,
        enum: ['restore-password', 'suscription', 'cancel-suscription', 'blocked-comment'],
        default: 'restore-password'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Email', emailSchema);