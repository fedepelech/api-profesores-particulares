'use strict';
const express = require('express');
const router = express.Router();
const logger = require('@lib/logger');
const { checkIfExistsBody, validateTeacherRole, validateClass } = require('@utils/middlewares/general');

function validateBody(req, res, next) {
    if(!req.body.status) {
        return res.status(400).json({
            code: 'missing_parameters',
            message: 'Missing parameters'
        });
    }
    if(!['HIDDEN', 'PUBLISHED', 'DELETED'].includes(req.body.status)) {
        return res.status(400).json({
            code: 'invalid_status',
            message: 'Invalid status'
        });
    }
    req.status = req.body.status;
    req.id = req.params.id;
    return next();
}

function validateTeacherClass(req, res, next) {
    if(req.class.teacher._id.toString() !== req.user.id) {
        return res.status(400).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    }
    return next();
}

function changeStatus(req, res) {
    const classToChange = req.class;
    classToChange.status = req.status;
    return classToChange.save()
        .then((classSaved) => {
            return res.status(200).json(classSaved);
        })
        .catch((err) => {
            logger.error(`error in /classes/${req.params.id}/status changeStatus - ${err.message}`);
            return res.status(500).json({
                error: 'internal_error',
                message: 'Internal error'
            });
        });

}

router.post('/classes/:id/status', 
    checkIfExistsBody,
    validateTeacherRole,
    validateBody,
    validateClass,
    validateTeacherClass,
    changeStatus
);

module.exports = router;