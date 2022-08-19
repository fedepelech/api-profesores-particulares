'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Aceptado', 'Bloqueado'],
        default: 'Pendiente'
    },
    reasonBlocked: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);