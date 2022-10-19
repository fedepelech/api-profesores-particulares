'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {User} = require('@lib/models');

function validateTeacher(req, res, next) {
    console.log(req.params);
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

router.get('/teacher/:id', 
    validateTeacher
);

module.exports = router;
