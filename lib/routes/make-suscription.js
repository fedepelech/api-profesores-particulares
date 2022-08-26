'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription} = require('@lib/models');
const { checkIfExistsBody } = require('@utils/middlewares/general');
const { validateClass } = require('../utils/middlewares/general');

function validateBody(req, res, next) {
    const b = req.body;
    if(!b.classId ||
       !b.phone ||
       !b.email ||
       !b.timeToContact ||
       !b.message) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    req.id = b.classId;
    return next();
}

//validar que no exista otra suscripción.

function makeSuscription(req, res) {
    const {classId, phone, email, timeToContact, message } = req.body;
    const newSuscription = new Suscription({
        student: req.user.id,
        class: classId,
        phone,
        email,
        timeToContact,
        message
    });
    return newSuscription.save()
        .then((suscription) => {
            return res.status(200).json(suscription);
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/create makeSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/suscriptions/create',
    checkIfExistsBody,
    validateBody,
    validateClass,
    makeSuscription
);

module.exports = router;