'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherInformationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('TeacherInformation', teacherInformationSchema);
