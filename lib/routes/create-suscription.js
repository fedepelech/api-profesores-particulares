'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription} = require('@lib/models');
const { validateClass } = require('../utils/middlewares/general');

function validateBody(req, res, next) {
    if(!req.body || !req.body.phone || !req.body.phoneCod || !req.body.email || !req.body.description || !req.body.timeToContact) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    req.id = req.params.id;
    return next();
}

function validateIfExist(req, res, next) {
    return Suscription.findOne({
        student: req.user.id,
        class: req.id
    })
        .then((sub) => {
            if(sub) {
                return res.status(400).json({
                    code: 'suscription_has_exist',
                    message: 'Suscription has exist'
                });
            }
            return next();
        })
        .catch((err) => {
            logger.error(`error in /class/${req.id}/suscription validateIfExist - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

function createSuscription(req, res) {
    const newSub = new Suscription({
        student: req.user.id,
        class: req.id,
        phone: req.body.phone,
        phoneCod: req.body.phoneCod,
        email: req.body.email,
        message: req.body.description,
        timeToContact: req.body.timeToContact
    })
    return newSub.save()
        .then((createdSub) => {
            return res.status(200).json(createdSub);
        })
        .catch((err) => {
            logger.error(`error in /class/${req.id}/suscription createSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/class/:id/suscription',
    validateBody,
    validateClass,
    validateIfExist,
    createSuscription
)

module.exports = router;