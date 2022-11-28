'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription, User} = require('@lib/models');
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
            logger.error(`error in /class/${req.params.id}/accept-suscription makeSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

function acceptSuscription(req, res, next) {
    const suscription = req.suscription;
    suscription.status = 'Aceptada';
    return suscription.save()
        .then((suscripSaved) => {
            req.suscripSaved = suscripSaved;
            req.student = suscription.student;
            req.class = suscription.class;
            return next();
        })
        .catch((err) => {
            logger.error(`error in /class/${req.params.id}/accept-suscription acceptSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
    }
    
function associateClassToUser(req, res) {
    return User.findById(req.student)
        .populate('classes')
        .then((student) => {
            if(!student) {
                return res.status(500);
            }
            student.classes.push(req.class);
            return student.save()
        })
        .then(() => {
            return res.status(200).json(req.suscripSaved);
        })
        .catch((err) => {
            logger.error(`error in /class/${req.params.id}/accept-suscription associateClassToUser - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/class/:id/accept-suscription',
    validateTeacherRole,
    validateSuscription,
    acceptSuscription,
    associateClassToUser
);

module.exports = router;