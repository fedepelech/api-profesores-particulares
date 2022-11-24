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
            logger.error(`error in /suscriptions/accept/${req.params.id} makeSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

function acceptSuscription(req, res, next) {
    const suscription = req.suscription;
    console.log('suscription: ',suscription);
    suscription.status = 'Aceptada';
    return suscription.save()
        .then((suscripSaved) => {
            req.suscripSaved = suscripSaved;
            req.student = suscription.student;
            req.class = suscription.class;
            return next();
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/accept/${req.params.id} acceptSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
    }
    
function associateClassToUser(req, res) {
    console.log(req.student);
    return User.findById(req.student)
        .populate('classes')
        .then((student) => {
            if(!student) {
                console.log('deberia hacer un rollback y tirar error 500');
                return res.status(500);
            }
            student.classes.push(req.class);
            console.log('req.student.classes: ', req.student.classes);
            return student.save()
        })
        .then(() => {
            console.log('se ha guardado con exito');
            return res.status(200).json(req.suscripSaved);
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/accept/${req.params.id} associateClassToUser - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/suscriptions/accept/:id',
    validateTeacherRole,
    validateSuscription,
    acceptSuscription,
    associateClassToUser
);

module.exports = router;