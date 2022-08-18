'use strict';
import {Schema, model} from "mongoose";

const teacherInformationSchema = new Schema({
    degree: { //titulo
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: number
    }
}, {
    timestamps: false
});

module.exports = model('TeacherInformation', teacherInformationSchema);
