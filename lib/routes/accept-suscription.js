'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription} = require('@lib/models');
const { validateTeacherRole } = require('@utils/middlewares/general');

function validateSuscription(req, res, next) {
    return Suscription.findById(req.params.id)
        .then((suscription) => {
            if(!suscription) {
                return res.status(404).json({
                    code: 'invalid_id',
                    message: 'Not found any suscription'
                });
            }
            req.suscription = suscription;
            return next();
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/accept/${req.params.id} makeSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

function acceptSuscription(req, res) {
    const suscription = req.suscription;
    suscription.status = 'Aceptada';
    return suscription.save()
        .then((suscripSaved) => {
            return res.status(200).json(suscripSaved);
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/accept/${req.params.id} acceptSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/suscriptions/accept/:id',
    validateTeacherRole,
    validateSuscription,
    acceptSuscription
);

module.exports = router;