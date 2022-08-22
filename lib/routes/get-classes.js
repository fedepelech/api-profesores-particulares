'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const {Class} = require('@lib/models');

//FALTA AGREGAR LA QUERY PARA QUE UN PROFESOR TRAIGA SUS CLASES Y PARA QUE UN ALUMNO TRAIGA LAS CLASES A LAS CUALES ESTA SUSCRIPTO
function buildQuery(req, res, next) {
    let filters = {};
    if(req.query.subject) {
        filters.subject = req.query.subject;
    }
    if(req.query.grupal) {
        filters.grupal = req.query.grupal === 'true';
    }
    if(req.query.frequency) {
        filters.frequency = req.query.frequency;
    }
    if(req.query.calification) {
        filters.calification = {$gte: Number(req.query.calification)}; //falta agregar el gte en la query.
    }
    req.filters = filters;
    return next();
}

function getClasses(req, res) {
    return Class.find(req.filters)
        .then((classes) => {
            return res.status(200).json(classes);
        })
        .catch((err) => {
            logger.error(`error in /classes getClasses - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        })
}

router.get('/classes',
    buildQuery,
    getClasses,
);

module.exports = router;