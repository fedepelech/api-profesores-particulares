'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gralCalificationSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    score: {
        type: Number,
        default: 0
    }, /*  Cada vez que haya una nueva calificación, este campo se va a poner en TRUE
           para que el schedule vuelva a calcularla. Luego del schedule */
    recalculate: {
        type: Number,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('GeneralCalification', gralCalificationSchema);