'use strict';
import {Schema, model} from "mongoose";

const suscriptionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class' 
    },
    status: {
        type: String,
        enum: ['Solicitada', 'Aceptada', 'Finalizada', 'Cancelada'],
        default: 'Solicitada'
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    timeToContact: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Suscription', suscriptionSchema);