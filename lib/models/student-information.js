'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentInformationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    birthDate: {
        type: Date,
        required: true
    },
    primarySchool: {
        type: String,
        enum: ['No iniciado', 'En curso', 'Finalizado'],
        default: 'No iniciado'
    },
    secondarySchool: {
        type: String,
        enum: ['No iniciado', 'En curso', 'Finalizado'],
        default: 'No iniciado'
    },
    tertiarySchool: {
        type: String,
        enum: ['No iniciado', 'En curso', 'Finalizado'],
        default: 'No iniciado'
    },
    university: {
        type: String,
        enum: ['No iniciado', 'En curso', 'Finalizado'],
        default: 'No iniciado'
    },
}, {
    timestamps: false
});

module.exports = mongoose.model('StudentInformation', studentInformationSchema);
