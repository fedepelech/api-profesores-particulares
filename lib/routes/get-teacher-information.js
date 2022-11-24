'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User, TeacherInformation} = require('@lib/models');

function validateTeacher(req, res, next) {
    return User.findOne({
        role: 'teacher',
        _id: req.params.id
    })
        .then((teacher) => {
            if(!teacher) {
                return res.status(400).json({
                    code: 'invalid_id',
                    message: 'Invalid id'
                });
            }
            req.teacher = teacher;
            return next();
        })
}

function getTeacherInformation(req, res) {
    return TeacherInformation.findOne({
        user: req.teacher._id
    })
        .then((teacherInformation) => {
            if(!teacherInformation) {
                return res.status(400).json({
                    code: 'invalid_id_teacher_information',
                    message: 'Invalid id (teacher information)'
                });
            }
            return res.status(200).json({
                personal: req.teacher,
                academic: teacherInformation});
        })
}

router.get('/teacher/:id', 
    validateTeacher,
    getTeacherInformation
);

module.exports = router;
