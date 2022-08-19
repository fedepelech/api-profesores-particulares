'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User, TeacherInformation, StudentInformation} = require('@lib/models');

//si no hay role es porque es STUDENT

function validateBodyTeacher(body) {
    let flag = true;
    if(!body.degree || !body.experience) {
        flag = false;
    }
    return flag;
}

function validateBodyStudent(body) {
    let flag = true;
    if(!body.birthDate ||
       !body.primarySchool ||
       !body.secondarySchool ||
       !body.tertiarySchool ||
       !body.university) {
        flag = false;
    }
    return flag;
}

function validateBody(req, res, next) {
    const body = req.body;
    const invalidBody = 
        !body.firstName ||
        !body.surName ||
        !body.email ||
        !body.password;
    console.log('body.role: ', body.role);
    const validInformationByRol = body.role ?
        validateBodyTeacher(body) :
        validateBodyStudent(body);
    if(invalidBody || !validInformationByRol) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    return next();
}

function validationEmail(req, res, next) {
    if(!((/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(req.body.email))) {
        return res.status(400).json({
            message: 'Invalid email',
            code: 'signup_failed'
        });
    }
    return next();
}

function checkIfExist(req, res, next) {
    return User.count({email: req.body.email})
        .then((count) => {
            if (count > 0) {
                return res.status(400).json({
                    error: 'Email already in use',
                    code: 'email_already_used'
                });
            }
            return next();
        })
        .catch((error) => {
            logger.error(`error in /signup checkIfExist - ${error.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'internal_error'
            });
        });
}

function createTeacherInformation(degree, experience, user) {
    const newTeacherInformation = new TeacherInformation({
        degree,
        experience,
        user: user._id
    });
    return newTeacherInformation.save();
}

function createStudentInformation(body, user) {
    const newStudentInformation = new StudentInformation({
        birthDate: body.birthDate,
        primarySchool: body.primarySchool,
        secondarySchool: body.secondarySchool,
        tertiarySchool: body.tertiarySchool,
        university: body.university,
        user: user._id
    });
    return newStudentInformation.save();
}

function createUser(req, res) {
    const roleToApply = req.body.role ? 'teacher' : 'student';
    const newUser = new User({
        firstName: req.body.firstName,
        surName: req.body.surName,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        role: roleToApply,
    });
    return newUser.save()
        .then((user) => {
            return (roleToApply === 'teacher' ?
                createTeacherInformation(req.body.degree, req.body.experience, user) :
                createStudentInformation(req.body, user)
            );
        })
        .then(() => {
            return res.status(200).json({
                message: 'User created sucessfully'
            });
        })
        .catch((err) => {
            logger.error(`error in /signup createUser - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/signup',
    validateBody,
    validationEmail,
    checkIfExist,
    createUser
);

module.exports = router;
