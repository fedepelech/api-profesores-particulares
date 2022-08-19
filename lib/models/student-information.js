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
        enum: ['No', 'En curso', 'Finalizada'],
        default: 'No'
    },
    secondarySchool: {
        type: String,
        enum: ['No', 'En curso', 'Finalizada'],
        default: 'No'
    },
    tertiarySchool: {
        type: String,
        enum: ['No', 'En curso', 'Finalizada'],
        default: 'No'
    },
    university: {
        type: String,
        enum: ['No', 'En curso', 'Finalizada'],
        default: 'No'
    },
}, {
    timestamps: false
});

module.exports = mongoose.model('StudentInformation', studentInformationSchema);
