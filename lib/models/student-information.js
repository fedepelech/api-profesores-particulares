'use strict';
import {Schema, model} from "mongoose";

const studentInformationSchema = new Schema({
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

module.exports = model('StudentInformation', studentInformationSchema);
