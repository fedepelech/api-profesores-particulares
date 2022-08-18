'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User} = require('@lib/models');

//si no hay role es porque es STUDENT

function validateBodyTeacher(body) {
    const flag = true;
    if(!body.title || !body.experience) {
        flag = false;
    }
    return flag;
}

function validateBodyStudent(body) {
    const flag = true;
    if(!body.bithDate || !body.schoolData) {
        flag = false;
    }
    return flag;
}

function validateBody(req, res, next) {
    if(!req.body) {
        return res.status(400).json({
            code: 'empty_body',
            message: 'The body can not be empty'
        })
    }
    const body = req.body;
    const invalidBody = 
        !body.firstName ||
        !body.surName ||
        !body.userName ||
        !body.email ||
        !body.password;
    const validInformationByRol = body.role ?
        validateBodyTeacher(body) :
        validateBodyStudent(body);
    if(invalidBody || !validInformationByRol) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        })
    }
    return next();
}

function validateEmail(req, res, next) {
    
}