'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User, StudentInformation} = require('@lib/models');

function validateStudent(req, res, next) {
    return User.findOne({
        role: 'student',
        _id: req.params.id
    })
        .then((student) => {
            if(!student) {
                return res.status(400).json({
                    code: 'invalid_id',
                    message: 'Invalid id'
                });
            }
            req.student = student;
            return next();
        })
}

function getStudentInformation(req, res) {
    return StudentInformation.findOne({
        user: req.student._id
    })
        .then((studentInformation) => {
            if(!studentInformation) {
                return res.status(400).json({
                    code: 'invalid_id_student_information',
                    message: 'Invalid id (student information)'
                });
            }
            return res.status(200).json({
                personal: req.student,
                academic: studentInformation});
        })
}

router.get('/student/:id', 
    validateStudent,
    getStudentInformation
);

module.exports = router;
