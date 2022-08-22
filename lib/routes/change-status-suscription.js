'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription} = require('@lib/models');
const { validateTeacherRole, checkIfExistsBody } = require('@utils/middlewares/general');

function validateBody(req, res, next) {
    if(!req.body.status || !['Finalizada', 'Cancelada'].includes(req.body.status)) {
        return res.status(400).json({
            code: 'invalid_status',
            message: 'Invalid status'
        });
    }
    req.status = req.body.status;
    return next();
}

function validateSuscription(req, res) {
    return Suscription.findById(req.params.id)
        .populate('class')
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
            logger.error(`error in /suscriptions/change-status/${req.params.id} validateSuscription - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

function validateForStudent(req, res, next) {
    if(req.suscription.student !== req.user.id) {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    }
    return next();
}

function validateForTeacher(req, res, next) {
    if(req.suscription.class.id !== req.user.id) {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    }
    return next();
}

function validateUser(req, res, next) {
    if(req.user.role === 'student') {
        return validateForStudent(req, res, next);
    } else {
        return validateForTeacher(req, res, next);
    }
}

function changeStatus(req, res) {
    const suscription = req.suscription;
    suscription.status = req.body.status;
    return suscription.save()
        .then((suscrSaved) => {
            return res.status(200).json(suscrSaved);
        })
        .catch((err) => {
            logger.error(`error in /suscriptions/change-status/${req.params.id} changeStatus - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post('/suscriptions/change-status/:id', 
    checkIfExistsBody,
    validateBody,
    validateSuscription,
    validateUser,
    changeStatus
);