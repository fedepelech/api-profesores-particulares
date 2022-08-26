'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Class} = require('@lib/models');
const { validateTeacherRole, checkIfExistsBody } = require('@utils/middlewares/general');

function validateBody(req, res, next) {
    const body = req.body;
    if( !body.name ||
        !body.subject ||
        !body.duration ||
        !body.frequency ||
        !body.cost ||
        !body.description ||
        !body.grupal) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    return next();
}

function createClass(req, res) {
    const { name, subject, duration, frequency, cost, description, grupal} = req.body;
    const newClass = new Class({
        name,
        subject,
        duration,
        frequency,
        cost,
        description,
        grupal,
        teacher: req.user.id
    });
    return newClass.save()
        .then((classCreated) => {
            return res.status(200).json(classCreated);
        })
        .catch((err) => {
            logger.error(`error in /classes/create createClass - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/classes/create',
    validateTeacherRole,
    checkIfExistsBody,
    validateBody,
    createClass
);

module.exports = router;