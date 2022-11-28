'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Suscription} = require('@lib/models');
const { validateClass, validateTeacherRole } = require('../utils/middlewares/general');

function prepareRoute(req, res, next) {
    req.id = req.params.id;
    return next();
}

function validateOwner(req, res, next) {
    const classToEdit = req.class;
    if(req.user.id !== classToEdit.teacher._id.toString()) {
      return res.status(401).json({
        code: 'unauthorized (not owner)',
        message: 'Unauthorized (not owner)'
      })
    }
    return next();
}

function getSuscriptions(req, res) {
    return Suscription.find({ class: req.class._id }).populate('student')
        .then((suscriptions) => {
            if(!suscriptions) {
                return res.status(200).json([]);
            }
            const pendingSuscriptions = suscriptions.filter((sub) => sub.status === 'Solicitada');
            const acceptedSuscriptions = suscriptions.filter((sub) => sub.status === 'Aceptada');
            const finishedSuscriptions = suscriptions.filter((sub) => sub.status === 'Finalizada');
            const canceledSuscriptions = suscriptions.filter((sub) => sub.status === 'Cancelada');
            return res.status(200).json({
                pending: pendingSuscriptions,
                accepted: acceptedSuscriptions,
                finished: finishedSuscriptions,
                canceled: canceledSuscriptions
            })
        })
        .catch((err) => {
            logger.error(`error in /class/${req.params.id}/suscriptions getSuscriptions - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.get('/class/:id/suscriptions',
    prepareRoute,
    validateTeacherRole,
    validateClass,
    validateOwner,
    getSuscriptions
);

module.exports = router;