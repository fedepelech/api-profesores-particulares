'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Class, User} = require('@lib/models');
const { getUserFromToken } = require('../utils/middlewares/general');

function validateToken(req, res, next) {
    if(!req.user) {
        return res.status(404).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    return next();
} 

function validateRole(req, res) {
    let promise;
    if(req.user.role === 'teacher') {
        promise = getClassesByTeacher(req.user.id); 
    }
    if(req.user.role === 'student') {
        promise = getClassesByStudent(req.user.id);
    }
    return promise
        .then((data) => {
            return res.status(200).json(data);
        })
}

function getClassesByTeacher(teacherId) {
    return Class.find({  teacher: teacherId }).populate('teacher');
}

function getClassesByStudent(studentId) {
    return User.findById(studentId)
        .populate({
            path: 'classes',
            populate: {
                path: 'teacher',
                model: 'User'
            }
        })
        .then((data) => {
            return data.classes;
        })
}

router.get('/my-classes',
    getUserFromToken,
    validateToken,
    validateRole
)

module.exports = router;
